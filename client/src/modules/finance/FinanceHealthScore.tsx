import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/apiClient";
import { Card } from "../../components/ui/Card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

export default function FinanceHealthScore() {
  const { data } = useQuery({
    queryKey: ["health-score"],
    queryFn: async () => (await api.get("/finance/health-score")).data,
  });

  const chartData = [{ name: "score", value: data?.score ?? 0, fill: "#1e3a8a" }];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">📊 Financial Health Score</h1>
      <p className="text-gray-500 mb-6">A transparent score based on your savings rate and debt load — not a black-box credit score.</p>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="flex flex-col items-center justify-center">
          <div className="w-48 h-48">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-3xl font-bold -mt-24">{data?.score ?? "—"}</p>
          <p className="text-sm text-gray-500 mt-24">out of 100</p>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">This month</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Income</span><span className="font-medium">₹{data?.monthlyIncome ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Expenses</span><span className="font-medium">₹{data?.monthlyExpenses ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Surplus</span><span className="font-medium">₹{data?.monthlySurplus ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Debt load</span><span className="font-medium">₹{data?.debtLoad ?? 0}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}