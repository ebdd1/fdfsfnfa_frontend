import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface DarkPanelProps {
  children: ReactNode;
  className?: string;
  padding?: "md" | "lg" | "xl";
}

export function DarkPanel({
  children,
  className = "",
  padding = "lg",
}: DarkPanelProps) {
  const reduce = useReducedMotion();

  const paddingStyles = {
    md: "p-6 md:p-8",
    lg: "p-8 md:p-12",
    xl: "p-10 md:p-16",
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-[36px] ${paddingStyles[padding]} ${className}`}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#18181B] via-[#1C1C1E] to-[#27272A]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B35]/5 via-transparent to-transparent" />
      {/* Subtle border */}
      <div className="absolute inset-0 rounded-[36px] border border-[rgba(255,255,255,0.08)]" />
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
