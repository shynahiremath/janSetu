import { NavLink } from "react-router-dom";
import { Sprout, HeartPulse, Wallet, LayoutDashboard } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agriculture", label: "Agriculture", icon: Sprout },
  { to: "/health", label: "Health", icon: HeartPulse },
  { to: "/finance", label: "Finance", icon: Wallet },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen sticky top-0 p-6 hidden md:block">
      <h1 className="text-xl font-bold mb-8 text-gray-900">🌉 Jan Setu</h1>
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}