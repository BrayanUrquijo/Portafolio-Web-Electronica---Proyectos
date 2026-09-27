import { cn } from "@/lib/utils";

type BadgeVariant = "cyan" | "magenta" | "violet" | "green" | "yellow" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  cyan: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
  magenta: "bg-neon-magenta/10 text-neon-magenta border-neon-magenta/30",
  violet: "bg-neon-violet/10 text-neon-violet border-neon-violet/30",
  green: "bg-neon-green/10 text-neon-green border-neon-green/30",
  yellow: "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/30",
  default: "bg-surface-elevated text-text-secondary border-surface-border",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
