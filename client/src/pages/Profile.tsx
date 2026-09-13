import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon, MapPin } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { useAuthStore } from "../store/authStore";
import { useLangStore } from "../store/langStore";
import { LANG_LABELS, type Lang } from "../i18n/translations";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const { lang, setLang, t } = useLangStore();
  const navigate = useNavigate();
  const [lng, lat] = user?.farmLocation?.coordinates ?? [0, 0];
  return (
    <div>
      <PageHeader title={t("nav.profile")} description="Account and preferences" />
      <Card className="mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><UserIcon size={24} className="text-gray-500" aria-hidden="true" /></div>
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">{user?.name || "User"}</h2>
            <p className="text-sm text-gray-500 capitalize">{user?.role || "farmer"}</p>
          </div>
        </div>
        {lat !== 0 && lng !== 0 && (
          <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100"><MapPin size={14} aria-hidden="true" />Location set ({lat.toFixed(2)}, {lng.toFixed(2)})</p>
        )}
      </Card>
      <Card className="mb-6">
        <Select label="Language" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
          {(Object.keys(LANG_LABELS) as Lang[]).map((code) => <option key={code} value={code}>{LANG_LABELS[code]}</option>)}
        </Select>
      </Card>
      <Button variant="secondary" fullWidth onClick={() => { logout(); navigate("/login"); }}>
        <LogOut size={18} aria-hidden="true" />{t("common.signOut")}
      </Button>
    </div>
  );
}
