import { Activity as ActivityIcon } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { useLangStore } from "../store/langStore";
export default function Activity() {
  const t = useLangStore((s) => s.t);
  return (
    <div>
      <PageHeader title={t("nav.activity")} description="Recent actions on your account" />
      <EmptyState title="No activity yet" description="When you use farming, health, or money tools, recent actions will appear here." icon={<ActivityIcon size={36} strokeWidth={1.5} />} />
    </div>
  );
}
