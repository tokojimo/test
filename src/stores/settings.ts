import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AccountState = {
  session: 'connected' | 'disconnected';
  email?: string;
};

export type SubscriptionState = {
  status: 'free' | 'premium';
  renewalDate?: string;
  trialEnds?: string;
  paymentError?: boolean;
};

export type AlertsState = {
  optimum: boolean;
  newZone: boolean;
};

export type PrefsState = {
  units: 'metric' | 'imperial';
  gps: boolean;
  lang: 'fr' | 'en';
  theme: 'system' | 'light' | 'dark';
};

export type SettingsState = {
  account: AccountState;
  subscription: SubscriptionState;
  alerts: AlertsState;
  prefs: PrefsState;
  updatedAt: number;
};

export type SettingsActions = {
  update: (partial: Partial<SettingsState>) => void;
  reset: () => void;
};

const defaultState: SettingsState = {
  account: { session: 'disconnected' },
  subscription: { status: 'free' },
  alerts: { optimum: false, newZone: false },
  prefs: { units: 'metric', gps: false, lang: 'fr', theme: 'system' },
  updatedAt: Date.now(),
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...defaultState,
      update: (partial) =>
        set((state) => ({ ...state, ...partial, updatedAt: Date.now() })),
      reset: () => set(defaultState),
    }),
    {
      name: 'settings-store',
      version: 1,
    }
  )
);

export const useAlerts = () => useSettingsStore((s) => s.alerts);
export const usePrefs = () => useSettingsStore((s) => s.prefs);
export const useAccount = () => useSettingsStore((s) => s.account);
export const useSubscription = () => useSettingsStore((s) => s.subscription);
