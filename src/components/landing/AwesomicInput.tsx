"use client";

import { AwesomicButton } from "./AwesomicButton";

interface AwesomicInputProps {
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function AwesomicInput({
  placeholder = "Enter your email",
  buttonText = "Get Started",
  onSubmit,
  className = "",
}: AwesomicInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    if (email && onSubmit) {
      onSubmit(email);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-3 ${className}`}
    >
      <input
        type="email"
        name="email"
        placeholder={placeholder}
        required
        className="flex-1 bg-card text-[text-body] placeholder-[text-muted] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[text-ink]/20 transition-all"
      />
      <AwesomicButton type="submit" size="md">
        {buttonText}
      </AwesomicButton>
    </form>
  );
}
