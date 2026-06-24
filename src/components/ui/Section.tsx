import React from "react";
import { cn } from "@/utils/cn";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  variant?: "default" | "card" | "elevated" | "transparent";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export function Section({
  children,
  as = "section",
  variant = "default",
  padding = "md",
  className,
  ...props
}: SectionProps) {
  const Component = as as any;
  return (
    <Component
      className={cn(
        "relative w-full overflow-hidden",
        {
          "bg-bg-dark": variant === "default",
          "bg-bg-card": variant === "card",
          "bg-bg-elevated": variant === "elevated",
          "bg-transparent": variant === "transparent",
        },
        {
          "py-0": padding === "none",
          "py-12 sm:py-16": padding === "sm",
          "py-20 sm:py-24": padding === "md",
          "py-28 sm:py-36": padding === "lg",
          "py-36 sm:py-48": padding === "xl",
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
