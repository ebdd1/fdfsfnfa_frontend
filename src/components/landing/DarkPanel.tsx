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
      className={`bg-ink rounded-[36px] ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
