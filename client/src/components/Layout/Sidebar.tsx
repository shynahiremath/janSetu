import { NavLink } from "react-router-dom";
import { Sprout, HeartPulse, Wallet, LayoutDashboard, Activity, User, HelpCircle } from "lucide-react";
import { useLangStore } from "../../store/langStore";

const main = [
  { to: "/", key: "nav.home", icon: LayoutDashboard, end: true },
  { to: "/agriculture", key: "nav.farming", icon: Sprout },
  { to: "/health", key: "nav.health", icon: HeartPulse },
  { to: "/finance", key: "nav.money", icon: Wallet },
];
const secondary = [
  { to: "/activity", key: "nav.activity", icon: Activity },
  { to: "/help", key: "nav.help", icon: HelpCircle },
  { to: "/profile", key: "nav.profile", icon: User },
];

export function Sidebar() {
  const t = useLangStore((s) => s.t);
  return (
    <aside className="w-56 lg:w-60 bg-white border-r border-gray-100 h-screen sticky top-0 p-4 lg:p-5 hidden md:flex md:flex-col">
      <div className="mb-6 px-2">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">{t("app.name")}</h1>
        <p className="text-xs text-gray-400 mt-1 leading-snug">{t("app.tagline")}</p>
      </div>
      <nav className="space-y-0.5 flex-1" aria-label="Main">
        {main.map(({ to, key, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium min-h-[44px] transition-colors ${isActive ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
            <Icon size={18} aria-hidden="true" />{t(key)}
          </NavLink>
        ))}
        <div className="my-3 border-t border-gray-100" role="separator" />
        {secondary.map(({ to, key, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium min-h-[44px] transition-colors ${isActive ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
            <Icon size={18} aria-hidden="true" />{t(key)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
