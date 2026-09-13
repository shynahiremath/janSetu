import { CheckCircle2, AlertTriangle, Info, Circle } from "lucide-react";
type V = "success" | "warning" | "urgent" | "info" | "neutral";
const STYLES: Record<V, string> = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  urgent: "bg-red-50 text-red-800 border-red-200",
  info: "bg-sky-50 text-sky-800 border-sky-200",
  neutral: "bg-gray-50 text-gray-700 border-gray-200",
};
const ICONS = { success: CheckCircle2, warning: AlertTriangle, urgent: AlertTriangle, info: Info, neutral: Circle };
export function StatusPill({ label, variant = "neutral", className = "" }: { label: string; variant?: V; className?: string }) {
  const Icon = ICONS[variant];
  return <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${STYLES[variant]} ${className}`}><Icon size={14} aria-hidden="true" />{label}</span>;
}
