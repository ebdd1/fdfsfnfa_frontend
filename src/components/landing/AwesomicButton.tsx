"use client";

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode, MouseEventHandler } from 'react';

interface AwesomicButtonProps {
  variant?: "primary" | "secondary" | "ghost";
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

  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };

  const variantStyles = {
    primary:
      "bg-[#FF6B35] text-white shadow-[0_0_24px_rgba(255,107,53,0.3)] hover:bg-[#E85A28] active:scale-[0.98] focus-visible:ring-[#FF6B35]",
    secondary:
      "bg-[#27272A] text-[#FAFAFA] border border-[rgba(255,255,255,0.1)] hover:bg-[#3F3F46] hover:border-[#FF6B35]/30 active:scale-[0.98] focus-visible:ring-[#FF6B35]",
    ghost:
      "bg-transparent text-[#FF6B35] hover:bg-[rgba(255,107,53,0.1)] active:scale-[0.98] focus-visible:ring-[#FF6B35]",
  };

  const radiusStyles = {
    sm: "rounded-lg",
    md: "rounded-lg",
    lg: "rounded-lg",
  };

  return (
    <motion.button
      whileHover={reduce ? {} : { scale: 1.02 }}
      whileTap={reduce ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${radiusStyles[size]} ${className}`}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
