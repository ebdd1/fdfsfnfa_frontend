"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, MouseEventHandler } from "react";

interface AwesomicButtonProps {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function AwesomicButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  type = "button",
  onClick,
}: AwesomicButtonProps) {
  const reduce = useReducedMotion();

  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "text-sm px-4 py-2",
    md: "text-sm md:text-base px-5 py-3",
    lg: "text-base px-6 py-4",
  };

  const variantStyles = {
    primary:
      "bg-[#09090b] text-white shadow-[var(--cta-shadow)] hover:shadow-[var(--cta-shadow)] active:translate-y-px focus-visible:ring-[#09090b]",
    outline:
      "bg-white text-[#3f3f46] border border-[#3f3f46] hover:bg-[#f4f4f5] active:translate-y-px focus-visible:ring-[#3f3f46]",
    ghost:
      "bg-transparent text-[#18181b] hover:bg-[#f4f4f5] active:translate-y-px focus-visible:ring-[#18181b]",
  };

  const radiusStyles = {
    primary: "rounded-[36px]",
    outline: "rounded-[36px]",
    ghost: "rounded-[14px]",
  };

  return (
    <motion.button
      whileHover={reduce ? {} : { scale: 1.02 }}
      whileTap={reduce ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${radiusStyles[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}