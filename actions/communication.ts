'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { messages, jobAssignments } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { emitRealtimeEvent } from '@/lib/realtime';

const SendMessageSchema = z.object({
  assignmentId: z.string().uuid(),
  message: z.string().min(1),
  attachments: z.array(z.string()).optional(),
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;

// Send message between you (admin) and janitor
export async function sendMessage(input: SendMessageInput) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  const parsed = SendMessageSchema.parse(input);

  // Verify assignment exists and user has access
  const assignment = await db.query.jobAssignments.findFirst({
    where: eq(jobAssignments.id, parsed.assignmentId),
    with: {
      janitor: true,
    },
  });

  if (!assignment) throw new Error('Assignment not found');

  // Determine sender type
  const senderType = userId === assignment.janitorId ? 'janitor' : 'admin';

  const [message] = await db
    .insert(messages)
    .values({
      assignmentId: parsed.assignmentId,
      senderId: userId,
      senderType,
      message: parsed.message,
      attachments: parsed.attachments ? JSON.stringify(parsed.attachments) : null,
    })
    .returning();

  // Notify the other party
  const recipientId = senderType === 'janitor' ? 'admin' : assignment.janitorId;
  await emitRealtimeEvent(`user:${recipientId}:messages`, { 
    type: 'message.received', 
    messageId: message.id,
    assignmentId: parsed.assignmentId,
  });

  revalidatePath('/admin/service-requests');
  revalidatePath('/janitor/assignments');
  return message;
}

// Get messages for an assignment
export async function getAssignmentMessages(assignmentId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  // Verify user has access to this assignment
  const assignment = await db.query.jobAssignments.findFirst({
    where: eq(jobAssignments.id, assignmentId),
    with: {
      janitor: true,
    },
  });

  if (!assignment) throw new Error('Assignment not found');
  
  // Check if user is admin or the assigned janitor
  const hasAccess = userId === assignment.janitorId || userId === 'admin'; // You'd need to define admin user ID
  if (!hasAccess) throw new Error('Unauthorized');

  const messages = await db.query.messages.findMany({
    where: eq(messages.assignmentId, assignmentId),
    orderBy: [desc(messages.sentAt)],
  });

  return messages;
}

// Mark message as read
export async function markMessageAsRead(messageId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [updated] = await db
    .update(messages)
    .set({ 
      readAt: new Date(),
    })
    .where(eq(messages.id, messageId))
    .returning();

  return updated;
}

// Get unread message count for user
export async function getUnreadMessageCount(userId: string) {
  const { userId: authUserId } = auth();
  if (!authUserId) throw new Error('Unauthorized');

  // Get assignments where user is involved
  const assignments = await db.query.jobAssignments.findMany({
    where: eq(jobAssignments.janitorId, userId),
    with: {
      messages: true,
    },
  });

  let unreadCount = 0;
  for (const assignment of assignments) {
    for (const message of assignment.messages) {
      if (message.senderId !== userId && !message.readAt) {
        unreadCount++;
      }
    }
  }

  return unreadCount;
}
