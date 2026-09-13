import { Outlet, NavLink } from "react-router-dom";
import { Sprout, HeartPulse, Wallet, LayoutDashboard, Menu, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { useLangStore } from "../../store/langStore";
import { LANG_LABELS, type Lang } from "../../i18n/translations";

const mobileLinks = [
  { to: "/", key: "nav.home", icon: LayoutDashboard, end: true },
  { to: "/agriculture", key: "nav.farming", icon: Sprout },
  { to: "/health", key: "nav.health", icon: HeartPulse },
  { to: "/finance", key: "nav.money", icon: Wallet },
];

export function DashboardShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, setLang, t } = useLangStore();
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar />
      <header className="md:hidden sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <h1 className="text-base font-bold text-gray-900">{t("app.name")}</h1>
        <div className="flex items-center gap-0.5">
          <button type="button" className="p-2.5 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600" onClick={() => { setLangOpen((o) => !o); setMenuOpen(false); }} aria-label="Language"><Globe size={20} /></button>
          <button type="button" className="p-2.5 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600" onClick={() => { setMenuOpen((o) => !o); setLangOpen(false); }} aria-label="Menu" aria-expanded={menuOpen}><Menu size={22} /></button>
        </div>
      </header>
      {langOpen && (
        <div className="md:hidden fixed inset-0 z-30" onClick={() => setLangOpen(false)}>
          <div className="absolute top-14 right-12 bg-white rounded-xl shadow-lg border border-gray-100 p-1.5 min-w-[148px]" onClick={(e) => e.stopPropagation()}>
            {(Object.keys(LANG_LABELS) as Lang[]).map((code) => (
              <button key={code} type="button" className={`w-full text-left px-3 py-2.5 rounded-lg text-sm min-h-[40px] ${lang === code ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"}`} onClick={() => { setLang(code); setLangOpen(false); }}>{LANG_LABELS[code]}</button>
            ))}
          </div>
        </div>
      )}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/20" onClick={() => setMenuOpen(false)}>
          <nav className="absolute top-14 right-3 bg-white rounded-xl shadow-lg border border-gray-100 p-1.5 min-w-[168px]" onClick={(e) => e.stopPropagation()} aria-label="More">
            {[{ to: "/activity", key: "nav.activity" }, { to: "/help", key: "nav.help" }, { to: "/profile", key: "nav.profile" }].map(({ to, key }) => (
              <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `block px-3 py-2.5 rounded-lg text-sm font-medium min-h-[40px] ${isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"}`}>{t(key)}</NavLink>
            ))}
          </nav>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="hidden md:flex items-center justify-end px-6 lg:px-8 pt-4" ref={langRef}>
          <div className="relative">
            <button type="button" className="inline-flex items-center gap-1.5 text-sm text-gray-600 px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 min-h-[40px]" onClick={() => setLangOpen((o) => !o)} aria-expanded={langOpen} aria-haspopup="listbox">
              <Globe size={16} aria-hidden="true" />{LANG_LABELS[lang]}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 p-1 min-w-[148px] z-20" role="listbox">
                {(Object.keys(LANG_LABELS) as Lang[]).map((code) => (
                  <button key={code} type="button" role="option" aria-selected={lang === code} className={`w-full text-left px-3 py-2 rounded-lg text-sm min-h-[40px] ${lang === code ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"}`} onClick={() => { setLang(code); setLangOpen(false); }}>{LANG_LABELS[code]}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <main className="flex-1 px-4 py-5 md:px-8 md:py-6 max-w-3xl lg:max-w-4xl mx-auto w-full pb-24 md:pb-10"><Outlet /></main>
      </div>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-100 safe-area-pb" aria-label="Bottom navigation">
        <div className="flex justify-around items-stretch h-16 max-w-lg mx-auto">
          {mobileLinks.map(({ to, key, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-col items-center justify-center gap-0.5 flex-1 text-[11px] font-medium ${isActive ? "text-gray-900" : "text-gray-400"}`}>
              <Icon size={22} aria-hidden="true" strokeWidth={1.75} />{t(key)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
