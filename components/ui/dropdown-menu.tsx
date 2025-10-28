import { cn } from '@/lib/utils';

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block text-left">{children}</div>;
}

export function DropdownMenuTrigger({ asChild, children }: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function DropdownMenuContent({ className, children }: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
