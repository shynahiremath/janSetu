import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";
type Kind = "info" | "warning" | "error" | "success";
const styles: Record<Kind, string> = {
  info: "bg-sky-50 border-sky-100 text-sky-900",
  warning: "bg-amber-50 border-amber-100 text-amber-900",
  error: "bg-red-50 border-red-100 text-red-900",
  success: "bg-emerald-50 border-emerald-100 text-emerald-900",
};
const icons = { info: Info, warning: AlertTriangle, error: AlertCircle, success: CheckCircle2 };
export function Alert({ children, kind = "info", className = "" }: { children: ReactNode; kind?: Kind; className?: string }) {
  const Icon = icons[kind];
  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-sm leading-relaxed ${styles[kind]} ${className}`} role={kind === "error" ? "alert" : "status"}>
      <Icon size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
