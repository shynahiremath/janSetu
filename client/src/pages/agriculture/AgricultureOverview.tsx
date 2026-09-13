import { Link } from "react-router-dom";
import { Droplets, TrendingUp, Store, Camera, ChevronRight } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
const tools = [
  { to: "/agriculture/irrigation", title: "Smart Irrigation", description: "Know when your crop needs water", icon: Droplets, accent: "bg-emerald-50 text-emerald-700" },
  { to: "/agriculture/yield", title: "Yield Estimate", description: "Estimate harvest from field conditions", icon: TrendingUp, accent: "bg-amber-50 text-amber-700" },
  { to: "/agriculture/market", title: "Market & Sell", description: "Compare mandis by net earnings", icon: Store, accent: "bg-sky-50 text-sky-700" },
  { to: "/agriculture/disease", title: "Crop Health", description: "Check leaf photos for diseases", icon: Camera, accent: "bg-violet-50 text-violet-700" },
];
export default function AgricultureOverview() {
  return (
    <div>
      <PageHeader title="Farming" description="Irrigation, yield, markets, and crop health." />
      <div className="space-y-2.5">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-2xl">
            <Card className="group-hover:shadow transition-shadow">
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tool.accent}`}><tool.icon size={20} aria-hidden="true" /></div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 text-[15px]">{tool.title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{tool.description}</p>
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
