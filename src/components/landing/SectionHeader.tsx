import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  headline: string | ReactNode;
  subtext?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  headline,
  subtext,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const alignStyles = {
    left: "text-left",
    center: "text-center mx-auto",
  };

  return (
    <div className={`max-w-2xl ${alignStyles[align]} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-[11px] font-medium uppercase tracking-[0.15em] text-[#71717a] mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-[32px] md:text-[40px] font-semibold leading-[1.25] text-[#18181b]">
        {headline}
      </h2>
      {subtext && (
        <p className="mt-4 text-base md:text-lg text-[#52525b] leading-relaxed max-w-[65ch]">
          {subtext}
        </p>
      )}
    </div>
  );
}
