import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../../lib/apiClient";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";

export default function MandiPrices() {
  const [commodity, setCommodity] = useState("Tomato");
  const user = useAuthStore((s) => s.user);
  const [farmLng, farmLat] = user?.farmLocation?.coordinates ?? [74.748, 19.0952];

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["best-sell", commodity],
    queryFn: async () => {
      const { data } = await api.get("/agriculture/mandi/best-sell", {
        params: { commodity, farmLat, farmLng },
      });
      return data;
    },
    enabled: false,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">🌾 Smart Sell & Transport</h1>
      <p className="text-gray-500 mb-4">Find where you'll actually net the most after transport cost.</p>

      <div className="flex gap-2 mb-6">
        <Link to="/agriculture" className="text-sm px-3 py-1.5 rounded-full bg-gray-900 text-white">Smart Sell</Link>
        <Link to="/agriculture/irrigation" className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">Smart Irrigation</Link>
        <Link to="/agriculture/yield" className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">Yield Prediction</Link>
      </div>

      <Card className="mb-6">
        <div className="flex gap-3">
          <Input value={commodity} onChange={(e) => setCommodity(e.target.value)} placeholder="Commodity (e.g. Tomato)" />
          <Button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Searching..." : "Find best mandi"}
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Currently only "Tomato" has live/seeded data — try that first.</p>
      </Card>

      <div className="space-y-3">
        {data?.length === 0 && (
          <p className="text-sm text-gray-500">No mandi data found for "{commodity}". Try "Tomato".</p>
        )}
        {data?.map((m: any, i: number) => (
          <Card key={i} className={i === 0 ? "border-agri border-2" : ""}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{m.market}, {m.district}</h3>
                <p className="text-sm text-gray-500">
                  Modal price ₹{m.modalPrice} · {m.distanceKm} km away · transport ≈ ₹{m.transportCost}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Net realization</p>
                <p className="text-xl font-bold text-agri">₹{m.netRealization}</p>
              </div>
            </div>
            {i === 0 && <span className="text-xs font-medium text-agri mt-2 inline-block">🏆 Best option</span>}
          </Card>
        ))}
      </div>
    </div>
  );
}