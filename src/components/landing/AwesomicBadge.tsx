import type { HTMLAttributes } from "react";

interface AwesomicBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "transparent-dark" | "filled-dark" | "ember";
  children: React.ReactNode;
}

export function AwesomicBadge({
  variant = "transparent-dark",
  children,
  className = "",
  ...props
}: AwesomicBadgeProps) {
  const variantStyles = {
    "transparent-dark":
      "bg-[#27272A] text-[#FAFAFA] border border-[rgba(255,255,255,0.1)]",
    "filled-dark": "bg-[#FF6B35] text-white",
    ember: "bg-[#FF6B35] text-white",
  };

  return (
    <span
      className={`inline-flex items-center rounded-[12px] px-2 py-1 text-xs font-medium tracking-wide ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
