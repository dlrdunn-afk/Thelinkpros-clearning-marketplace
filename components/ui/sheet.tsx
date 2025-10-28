import { cn } from '@/lib/utils';

export function Sheet({ children, open, onOpenChange }: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}

export function SheetTrigger({ children }: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function SheetContent({ className, children }: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 z-50 h-full w-[400px] bg-background p-6 shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function SheetTitle({ className, children }: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className={cn('text-lg font-semibold', className)}>
      {children}
    </h2>
  );
}

export function SheetDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground">
      {children}
    </p>
  );
}
