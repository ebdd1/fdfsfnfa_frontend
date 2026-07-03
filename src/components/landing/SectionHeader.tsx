import type { ReactNode } from 'react';

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
        <span className="inline-block text-xs font-medium uppercase tracking-wider text-[#FF6B35] mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold text-[#FAFAFA] leading-tight">
        {headline}
      </h2>
      {subtext && (
        <p className="mt-4 text-base md:text-lg text-[#A1A1AA] leading-relaxed max-w-2xl">
          {subtext}
        </p>
      )}
    </div>
  );
}
