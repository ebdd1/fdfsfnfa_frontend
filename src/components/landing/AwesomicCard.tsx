"use client";

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode, MouseEventHandler } from 'react';

interface AwesomicCardProps {
  variant?: "elevated" | "outline" | "primary";
  padding?: "sm" | "md" | "lg";
  children: ReactNode;
  hoverable?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function AwesomicCard({
  variant = "elevated",
  padding = "md",
  children,
  hoverable = false,
  className = "",
  onClick,
}: AwesomicCardProps) {
  const reduce = useReducedMotion();

  const variantStyles = {
    elevated: "bg-card border border-default shadow-sm hover:shadow-md",
    outline: "bg-card border-2 border-primary",
    primary: "bg-primary text-white",
  };

  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const cardClass = `rounded-lg transition-all duration-200 ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverable ? "cursor-pointer" : ""} ${className}`;

  if (hoverable && !reduce) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cardClass}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={cardClass}>
      {children}
    </div>
  );
}
