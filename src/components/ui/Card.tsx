import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-surface-border bg-surface-card p-4",
        "transition-all duration-300",
        hover && "hover:border-neon-cyan/50 hover:glow-sm hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
