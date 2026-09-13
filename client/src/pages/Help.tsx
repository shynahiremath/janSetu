import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { useLangStore } from "../store/langStore";
const faqs = [
  { q: "What is Jan Setu?", a: "A platform for rural communities covering farming decisions, basic health guidance, and simple money tools." },
  { q: "Is the health check a diagnosis?", a: "No. It only gives preliminary guidance. Always see a doctor or health worker for medical advice." },
  { q: "Is the financial score official?", a: "No. Scores on Jan Setu are educational estimates based on your recorded data, not CIBIL or bank scores." },
  { q: "Where do market prices come from?", a: "Where available, from Agmarknet via data.gov.in. If data is missing, the screen says so clearly." },
];
export default function Help() {
  const t = useLangStore((s) => s.t);
  return (
    <div>
      <PageHeader title={t("nav.help")} description="How Jan Setu works" />
      <div className="space-y-2.5">
        {faqs.map((f, i) => (
          <Card key={i} padding="sm">
            <h2 className="font-semibold text-gray-900 text-sm mb-1">{f.q}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
