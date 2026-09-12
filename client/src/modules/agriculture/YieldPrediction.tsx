import { useState } from "react";
import { api } from "../../lib/apiClient";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { TrendingUp, Lightbulb } from "lucide-react";

export default function YieldPrediction() {
  const [form, setForm] = useState({
    crop: "Tomato",
    farmArea: "",
    soilType: "loamy",
    previousYield: "",
    rainfall: "",
    temperature: "",
    fertilizerUsage: "medium",
    irrigationAvailable: true,
    growthStage: "vegetative",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePredict() {
    setError("");
    if (!form.crop || !form.farmArea) {
      setError("Crop and farm area are required.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/yield/predict", form);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">📈 Crop Yield Prediction</h1>
      <p className="text-gray-500 mb-6">Estimate your expected harvest based on farm and environmental conditions.</p>

      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Crop</label>
            <Input value={form.crop} onChange={(e) => update("crop", e.target.value)} placeholder="e.g. Tomato" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Farm area (hectares)</label>
            <Input type="number" value={form.farmArea} onChange={(e) => update("farmArea", e.target.value)} placeholder="e.g. 1.5" />
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
            <label className="text-xs font-medium text-gray-500 mb-1 block">Previous yield (tonnes/hectare, optional)</label>
            <Input type="number" value={form.previousYield} onChange={(e) => update("previousYield", e.target.value)} placeholder="e.g. 22" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Season rainfall (mm)</label>
            <Input type="number" value={form.rainfall} onChange={(e) => update("rainfall", e.target.value)} placeholder="e.g. 600" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Average temperature (°C)</label>
            <Input type="number" value={form.temperature} onChange={(e) => update("temperature", e.target.value)} placeholder="e.g. 28" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Fertilizer usage</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
              value={form.fertilizerUsage}
              onChange={(e) => update("fertilizerUsage", e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Irrigation available?</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
              value={form.irrigationAvailable ? "yes" : "no"}
              onChange={(e) => update("irrigationAvailable", e.target.value === "yes")}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

        <Button className="mt-4" onClick={handlePredict} disabled={loading}>
          {loading ? "Predicting..." : "Predict yield"}
        </Button>
      </Card>

      {result && (
        <div className="grid md:grid-cols-2 gap-5">
          <Card className="bg-gradient-to-br from-agri-light to-white border-agri/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-agri" size={20} />
              <p className="text-sm font-medium text-gray-500">Predicted yield</p>
            </div>
            <p className="text-3xl font-bold text-agri">{result.predictedYieldPerHectare} t/ha</p>
            {result.predictedTotalYield && (
              <p className="text-sm text-gray-500 mt-1">{result.predictedTotalYield} tonnes total for your farm</p>
            )}
            <span className="inline-block mt-3 text-xs px-2 py-1 rounded-full bg-agri/10 text-agri font-medium">
              {result.confidence} confidence
            </span>
          </Card>

          <Card>
            <p className="text-sm font-semibold mb-3">Prediction factors</p>
            <div className="space-y-2">
              {result.factors.map((f: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{f.label}</span>
                  <span className={f.impact.startsWith("Limiting") ? "text-red-600 font-medium" : "text-agri font-medium"}>
                    {f.impact}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="text-amber-500" size={18} />
              <p className="text-sm font-semibold">Suggestions to improve yield</p>
            </div>
            <ul className="space-y-1.5">
              {result.suggestions.map((s: string, i: number) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-agri mt-1">•</span> {s}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}