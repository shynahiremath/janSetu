import { Link } from "react-router-dom";
import { Stethoscope, ChevronRight } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Alert } from "../../components/ui/Alert";
export default function HealthcareOverview() {
  return (
    <div>
      <PageHeader title="Health" description="Preliminary guidance only \u2014 not a diagnosis." />
      <Alert kind="warning" className="mb-5">This tool does not diagnose disease or replace a doctor. Seek professional care when needed.</Alert>
      <Link to="/health/check" className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-2xl">
        <Card className="group-hover:shadow transition-shadow">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0"><Stethoscope size={20} aria-hidden="true" /></div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 text-[15px]">Health Check</h2>
              <p className="text-sm text-gray-500 mt-0.5">Guidance based on symptoms you select</p>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500" aria-hidden="true" />
          </div>
        </Card>
      </Link>
    </div>
  );
}
