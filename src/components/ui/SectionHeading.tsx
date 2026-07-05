import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "default" | "light";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  tone = "default",
  className
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p
        className={cn(
          "mb-3 text-xs font-bold uppercase tracking-[0.22em]",
          tone === "light" ? "text-amber-300" : "text-amber-600"
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-heading text-3xl font-bold leading-tight sm:text-4xl",
          tone === "light" ? "text-white" : "text-stonewarm-950"
        )}
      >
        {title}
      </h2>
      {children ? (
        <p
          className={cn(
            "mt-4 text-base leading-7",
            tone === "light" ? "text-white/74" : "text-stonewarm-700"
          )}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}
