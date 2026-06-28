"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, MouseEventHandler } from "react";

interface AwesomicCardProps {
  variant?: "white" | "muted" | "dark" | "decorative";
  padding?: "sm" | "md" | "lg";
  children: ReactNode;
  hoverable?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function AwesomicCard({
  variant = "white",
  padding = "md",
  children,
  hoverable = false,
  className = "",
  onClick,
}: AwesomicCardProps) {
  const reduce = useReducedMotion();

  const variantStyles = {
    white: "bg-white border border-[#e8e8ea]",
    muted: "bg-[#ececee] border border-transparent",
    dark: "bg-[#09090b] text-white",
    decorative: "bg-[#fe45e2] text-white",
  };

  const paddingStyles = {
    sm: "p-5",
    md: "p-6 md:p-7",
    lg: "p-8 md:p-9",
  };

  const cardClass = `rounded-[36px] transition-transform duration-200 ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverable ? 'cursor-pointer' : ''} ${className}`;

  if (hoverable && !reduce) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4 }}
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