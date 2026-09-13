import { InputHTMLAttributes, forwardRef } from "react";
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; hint?: string; error?: string; }
export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, hint, error, className = "", id, ...props }, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>}
      <input ref={ref} id={inputId} className={`w-full px-4 py-3 rounded-xl border bg-white text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 placeholder:text-gray-400 ${error ? "border-red-300" : "border-gray-200"} ${className}`} aria-invalid={error ? true : undefined} {...props} />
      {hint && !error && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1.5" role="alert">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";
