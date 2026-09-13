import { Link } from "react-router-dom";
import { Sprout, HeartPulse, Wallet, ChevronRight, Droplets, Store, Stethoscope } from "lucide-react";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuthStore } from "../store/authStore";
import { useLangStore } from "../store/langStore";

const domains = [
  { to: "/agriculture", title: "Farming", description: "Irrigation, yield, markets, crop health", icon: Sprout, accent: "bg-emerald-50 text-emerald-700" },
  { to: "/health", title: "Health", description: "Preliminary health guidance", icon: HeartPulse, accent: "bg-sky-50 text-sky-700" },
  { to: "/finance", title: "Money", description: "Khatabook and financial health", icon: Wallet, accent: "bg-indigo-50 text-indigo-700" },
];
const quick = [
  { to: "/agriculture/irrigation", label: "Irrigation", icon: Droplets },
  { to: "/agriculture/market", label: "Markets", icon: Store },
  { to: "/health/check", label: "Health check", icon: Stethoscope },
];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const t = useLangStore((s) => s.t);
  const name = user?.name?.split(" ")[0] || "there";
  return (
    <div>
      <PageHeader title={`${t("dashboard.hello")}, ${name}`} description={t("dashboard.choose")} />
      <section className="space-y-2.5 mb-8" aria-label="Services">
        {domains.map((d) => (
          <Link key={d.to} to={d.to} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-2xl">
            <Card className="group-hover:shadow transition-shadow">
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${d.accent}`}><d.icon size={20} aria-hidden="true" /></div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 text-[15px]">{d.title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{d.description}</p>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 shrink-0" aria-hidden="true" />
              </div>
            </Card>
          </Link>
        ))}
      </section>
      <section aria-label="Quick actions">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Quick actions</h2>
        <div className="grid grid-cols-3 gap-2">
          {quick.map((a) => (
            <Link key={a.to} to={a.to} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-50 min-h-[72px]">
              <a.icon size={20} className="text-gray-500" aria-hidden="true" />{a.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
