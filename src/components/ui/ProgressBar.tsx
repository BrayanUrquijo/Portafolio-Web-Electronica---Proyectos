import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 rounded-full bg-surface-elevated overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
