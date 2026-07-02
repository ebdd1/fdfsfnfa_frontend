import { motion, useReducedMotion } from "framer-motion";

interface StatBlockProps {
  value: string;
  label: string;
  className?: string;
}

export function StatBlock({ value, label, className = "" }: StatBlockProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`text-center ${className}`}
    >
      <div className="text-[40px] md:text-[48px] lg:text-[56px] font-bold text-[text-ink] leading-[1]">
        {value}
      </div>
      <div className="mt-2 text-[13px] text-[text-muted] leading-[1.56]">
        {label}
      </div>
    </motion.div>
  );
}
