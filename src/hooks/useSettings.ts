import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, type SiteSettings } from '../services/api/settings.service';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Global site settings, read from the public GET /settings endpoint and mirrored
 * into a Zustand store so every component renders the admin-configured values
 * (site name, contact, cities, feature flags). Falls back to DEFAULT_SETTINGS
 * while loading so the UI is never empty.
 */
export const useSettings = () => {
  const { settings, setSettings } = useSettingsStore();

  const query = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getPublic,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      setSettings(query.data);
    }
  }, [query.data, setSettings]);

  return {
    settings: query.data ?? settings,
    isLoading: query.isLoading,
  };
};

/**
 * Admin-only: load the full settings and persist edits via PUT /admin/settings.
 * On success it invalidates the public ['settings'] query so the whole app
 * re-renders with the new values immediately.
 */
export const useAdminSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-settings'],
    queryFn: settingsService.getAdminAll,
  });

  const mutation = useMutation({
    mutationFn: (settings: SiteSettings) => settingsService.update(settings),
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-settings'], data);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return {
    ...query,
    updateSettings: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
};
