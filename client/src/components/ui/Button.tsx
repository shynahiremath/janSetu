import { ButtonHTMLAttributes } from "react";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}
export function Button({ variant = "primary", size = "md", fullWidth = false, className = "", children, disabled, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = { sm: "px-3 py-2 text-sm min-h-[36px]", md: "px-4 py-2.5 text-sm min-h-[44px]", lg: "px-5 py-3 text-base min-h-[48px]" };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`} disabled={disabled} {...props}>{children}</button>;
}
