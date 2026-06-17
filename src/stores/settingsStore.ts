import { create } from 'zustand';
import { DEFAULT_SETTINGS, type SiteSettings } from '../services/api/settings.service';

interface SettingsState {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,
  setSettings: (settings) => set({ settings }),
}));
