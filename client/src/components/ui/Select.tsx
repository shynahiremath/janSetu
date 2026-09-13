import { SelectHTMLAttributes } from "react";
export function Select({ label, className = "", id, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  return (
    <div className="w-full">
      {label && <label htmlFor={selectId} className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>}
      <select id={selectId} className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${className}`} {...props}>{children}</select>
    </div>
  );
}
