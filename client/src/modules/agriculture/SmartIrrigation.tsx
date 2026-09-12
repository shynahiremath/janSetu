import { useState } from "react";
import { api } from "../../lib/apiClient";
import { useAuthStore } from "../../store/authStore";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Droplet, AlertTriangle, CheckCircle2, Cloud, Droplets, Wind } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const STATUS_STYLES: Record<string, string> = {
  not_required: "bg-agri-light border-agri/30 text-agri",
  required_soon: "bg-amber-50 border-amber-300 text-amber-700",
  required_immediately: "bg-red-50 border-red-300 text-red-700",
};

const STATUS_ICONS: Record<string, any> = {
  not_required: CheckCircle2,
  required_soon: Droplet,
  required_immediately: AlertTriangle,
};

export default function SmartIrrigation() {
  const user = useAuthStore((s) => s.user);
  const [farmLng, farmLat] = user?.farmLocation?.coordinates ?? [74.748, 19.0952];
  const { data: weather } = useQuery({
  queryKey: ["weather", farmLat, farmLng],
  queryFn: async () => {
    const { data } = await api.get("/agriculture/weather", {
      params: { lat: farmLat, lng: farmLng },
    });
    return data;
  },
});
  const [form, setForm] = useState({
    crop: "Tomato",
    soilType: "loamy",
    soilMoisture: "",
    farmSize: "",
    temperature: "",
    recentRainfall: "",
    growthStage: "vegetative",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCheck() {
    setError("");
    if (!form.soilMoisture || !form.temperature) {
      setError("Soil moisture and temperature are required.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/irrigation/check", {
        ...form,
        lat: farmLat,
        lng: farmLng,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const Icon = result ? STATUS_ICONS[result.status] : Droplet;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">💧 Smart Irrigation</h1>
      <p className="text-gray-500 mb-6">Enter your field conditions to get a clear watering recommendation.</p>
      {weather && (
  <Card className="mb-6 bg-gradient-to-r from-sky-50 to-blue-50 border-sky-100">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <Cloud className="text-sky-600" size={28} />
        <div>
          <p className="text-2xl font-bold">{Math.round(weather.current.temp)}°C</p>
          <p className="text-sm text-gray-500 capitalize">{weather.current.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Droplets size={16} /> {weather.current.humidity}% humidity
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Wind size={16} /> {weather.current.windSpeed} m/s wind
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {weather.forecast.slice(0, 5).map((f: any) => (
          <div key={f.date} className="text-center bg-white/60 rounded-lg px-2 py-1 min-w-[56px]">
            <p className="text-[10px] text-gray-500">{f.date.slice(5)}</p>
            <p className="text-sm font-semibold">{Math.round(f.temp)}°</p>
            <p className="text-[10px] text-sky-600">{Math.round(f.rainProbability * 100)}%</p>
          </div>
        ))}
      </div>
    </div>
  </Card>
)}
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Crop</label>
            <Input value={form.crop} onChange={(e) => update("crop", e.target.value)} placeholder="e.g. Tomato" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Soil type</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
              value={form.soilType}
              onChange={(e) => update("soilType", e.target.value)}
            >
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
              <option value="clay">Clay</option>
              <option value="black cotton">Black cotton</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Soil moisture (%)</label>
            <Input type="number" value={form.soilMoisture} onChange={(e) => update("soilMoisture", e.target.value)} placeholder="e.g. 25" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Current temperature (°C)</label>
            <Input type="number" value={form.temperature} onChange={(e) => update("temperature", e.target.value)} placeholder="e.g. 32" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Farm size (acres)</label>
            <Input type="number" value={form.farmSize} onChange={(e) => update("farmSize", e.target.value)} placeholder="e.g. 2" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Recent rainfall, last 3 days (mm)</label>
            <Input type="number" value={form.recentRainfall} onChange={(e) => update("recentRainfall", e.target.value)} placeholder="e.g. 0" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Growth stage</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
              value={form.growthStage}
              onChange={(e) => update("growthStage", e.target.value)}
            >
              <option value="seedling">Seedling</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="fruiting">Fruiting</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

        <Button className="mt-4" onClick={handleCheck} disabled={loading}>
          {loading ? "Analyzing..." : "Get recommendation"}
        </Button>
      </Card>

      {result && (
        <Card className={`border-2 ${STATUS_STYLES[result.status]}`}>
          <div className="flex items-start gap-3">
            <Icon className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold uppercase text-xs tracking-wide mb-1">{result.statusLabel}</p>
              <p className="mb-3">{result.reason}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {result.recommendedTotalLiters && (
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Recommended water</p>
                    <p className="font-semibold">{result.recommendedTotalLiters.toLocaleString()} L total</p>
                  </div>
                )}
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Check again in</p>
                  <p className="font-semibold">{result.recommendedFrequencyDays} day(s)</p>
                </div>
              </div>
              {result.weatherSummary && (
                <p className="text-xs text-gray-500 mt-3">
                  Tomorrow's forecast: {Math.round(result.weatherSummary.temp)}°C, {Math.round(result.weatherSummary.rainProbability * 100)}% chance of rain.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}