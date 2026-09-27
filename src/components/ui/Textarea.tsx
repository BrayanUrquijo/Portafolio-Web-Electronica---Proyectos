import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full px-3 py-2 rounded-lg text-sm min-h-[120px] resize-y",
          "bg-surface-secondary border border-surface-border",
          "text-text-primary placeholder:text-text-muted",
          "focus:outline-none focus:border-neon-cyan focus:glow-sm",
          "transition-all duration-200",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
