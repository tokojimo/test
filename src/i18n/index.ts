import common from './common';
import landing from './landing';
import settings from './settings';
import privacy from './privacy';
import terms from './terms';
import { useAppContext } from '../context/AppContext';

export const TRANSLATIONS: Record<string, { fr: string; en: string }> = Object.assign(
  {},
  common,
  landing,
  settings,
  privacy,
  terms,
);

export function useT() {
  const { state } = useAppContext();
  const lang = state.prefs.lang;
  const t = (key: string, vars?: Record<string, any>) => {
    let str = TRANSLATIONS[key]?.[lang] ?? key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(`{${k}}`, String(vars[k]));
      });
    }
    return str;
  };
  return { t, lang };
}
