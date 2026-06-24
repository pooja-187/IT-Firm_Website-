import React from "react";
import { cn } from "@/utils/cn";

interface AppContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function AppContainer({
  children,
  as = "div",
  className,
  ...props
}: AppContainerProps) {
  const Component = as as any;
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-[1440px] px-[clamp(16px,4vw,48px)]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
