import { Card } from "../components/ui/Card";
import { useAuthStore } from "../store/authStore";
import { Sprout, HeartPulse, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  const modules = [
    { to: "/agriculture", title: "Agriculture", desc: "Best mandi to sell, and crop disease detection", icon: Sprout, color: "bg-agri-light text-agri" },
    { to: "/health", title: "Health", desc: "Symptom check and nearby care", icon: HeartPulse, color: "bg-health-light text-health" },
    { to: "/finance", title: "Finance", desc: "Khatabook and financial health score", icon: Wallet, color: "bg-blue-50 text-finance" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name || "farmer"} 👋</h1>
      <p className="text-gray-500 mb-8">Here's your Jan Setu overview.</p>
      <div className="grid md:grid-cols-3 gap-5">
        {modules.map((m) => (
          <Link key={m.to} to={m.to}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${m.color}`}>
                <m.icon size={20} />
              </div>
              <h2 className="font-semibold text-lg mb-1">{m.title}</h2>
              <p className="text-gray-500 text-sm">{m.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}