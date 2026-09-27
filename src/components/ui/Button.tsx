"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/20 hover:glow-cyan",
  secondary:
    "bg-neon-violet/10 text-neon-violet border-neon-violet/50 hover:bg-neon-violet/20 hover:glow-violet",
  ghost:
    "bg-transparent text-text-secondary border-surface-border hover:text-text-primary hover:border-text-muted",
  danger:
    "bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20",
};

export function Button({
  variant = "primary",
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium",
        "rounded-lg border transition-all duration-200",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {isLoading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
