import { Link } from "react-router-dom";
import { BookOpen, Gauge, ChevronRight } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
const tools = [
  { to: "/finance/khatabook", title: "Khatabook", description: "Money you owe and money owed to you", icon: BookOpen, accent: "bg-amber-50 text-amber-700" },
  { to: "/finance/score", title: "Financial Health", description: "Based on your recorded income and debt", icon: Gauge, accent: "bg-indigo-50 text-indigo-700" },
];
export default function FinanceOverview() {
  return (
    <div>
      <PageHeader title="Money" description="Simple tracking and transparent estimates." />
      <div className="space-y-2.5">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-2xl">
            <Card className="group-hover:shadow transition-shadow">
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${t.accent}`}><t.icon size={20} aria-hidden="true" /></div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 text-[15px]">{t.title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{t.description}</p>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 shrink-0" aria-hidden="true" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
