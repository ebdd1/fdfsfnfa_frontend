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
      "bg-transparent text-ink border border-white/30",
    "filled-dark": "bg-[#3f3f46] text-[#fafafa]",
    ember: "bg-[#ff5a00] text-ink",
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
