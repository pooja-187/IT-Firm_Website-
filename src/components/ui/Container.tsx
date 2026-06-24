import React from "react";
import { cn } from "@/utils/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function Container({
  children,
  as = "div",
  size = "xl",
  className,
  ...props
}: ContainerProps) {
  const Component = as as any;
  return (
    <Component
      className={cn(
        "mx-auto w-full",
        // Using requested cinematic clamp padding
        "px-[clamp(16px,4vw,48px)]",
        {
          "max-w-3xl": size === "sm",
          "max-w-5xl": size === "md",
          "max-w-7xl": size === "lg",
          "max-w-[1440px]": size === "xl", // Set to exact 1440px requested
          "max-w-[1536px]": size === "2xl",
          "max-w-full": size === "full",
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
