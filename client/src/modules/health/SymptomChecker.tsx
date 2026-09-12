import { useState } from "react";
import { api } from "../../lib/apiClient";
import { db } from "../../lib/db";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { AlertTriangle } from "lucide-react";

const COMMON_SYMPTOMS = ["Fever", "Cough", "Headache", "Chest pain", "Difficulty breathing", "Vomiting", "Diarrhea", "Fatigue"];

const TIER_STYLES: Record<string, string> = {
  emergency: "bg-red-50 border-red-300 text-red-700",
  medium: "bg-amber-50 border-amber-300 text-amber-700",
  low: "bg-health-light border-health/30 text-health",
};

export default function SymptomChecker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function toggle(symptom: string) {
    setSelected((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]));
  }

  async function handleCheck() {
    setLoading(true);
    const payload = { symptoms: selected, lat: 19.0952, lng: 74.748 };
    try {
      if (!navigator.onLine) throw new Error("offline");
      const { data } = await api.post("/health/symptom-check", payload);
      setResult(data);
    } catch {
      await db.symptomLogs.add({ ...payload, synced: false });
      setResult({
        urgencyTier: "low",
        recommendedAction: "Saved offline. This will be reviewed once you're back online.",
        offline: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">🩺 Symptom Check</h1>
      <p className="text-gray-500 mb-6">Select what you're experiencing. This gives guidance, not a diagnosis.</p>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((s) => (
            <button
              key={s}
              onClick={() => toggle(s)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                selected.includes(s) ? "bg-health text-white border-health" : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <Button className="mt-5" onClick={handleCheck} disabled={loading || selected.length === 0}>
          {loading ? "Checking..." : "Check symptoms"}
        </Button>
      </Card>

      {result && (
        <Card className={`border-2 ${TIER_STYLES[result.urgencyTier] || ""}`}>
          <div className="flex items-start gap-3">
            {result.urgencyTier === "emergency" && <AlertTriangle className="mt-0.5" />}
            <div>
              <p className="font-semibold uppercase text-xs tracking-wide mb-1">{result.urgencyTier} priority</p>
              <p>{result.recommendedAction}</p>
              {result.note && <p className="text-xs text-gray-500 mt-2">{result.note}</p>}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}