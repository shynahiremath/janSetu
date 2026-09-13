import { ReactNode } from "react";
export function Card({ children, className = "", padding = "md" }: { children: ReactNode; className?: string; padding?: "sm" | "md" | "lg" | "none" }) {
  const paddings = { none: "", sm: "p-4", md: "p-5", lg: "p-6 md:p-8" };
  return <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${paddings[padding]} ${className}`}>{children}</div>;
}
