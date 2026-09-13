import { create } from "zustand";
import type { Lang } from "../i18n/translations";
import { t as translate } from "../i18n/translations";
function loadLang(): Lang {
  const s = localStorage.getItem("jan-setu-lang");
  if (s === "hi" || s === "mr" || s === "kn" || s === "en") return s;
  return "en";
}
interface LangState { lang: Lang; setLang: (lang: Lang) => void; t: (key: string) => string; }
export const useLangStore = create<LangState>((set, get) => ({
  lang: loadLang(),
  setLang: (lang) => { localStorage.setItem("jan-setu-lang", lang); set({ lang }); },
  t: (key) => translate(get().lang, key),
}));
