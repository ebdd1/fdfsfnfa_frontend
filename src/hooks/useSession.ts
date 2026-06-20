import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/api/auth.service';
import { useAuthStore } from '../stores/authStore';

/**
 * Server-validated session check [F-003].
 * Hits /auth/me — backend verifies the httpOnly cookie JWT.
 * Fills authStore with fresh user data from the database.
 * Re-validates on window focus and every 5 minutes.
 */
export function useSession() {
  const { setUser, clearUser } = useAuthStore();

  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const user = await authService.getMe();
        setUser(user);
        return user;
      } catch {
        clearUser();
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,     // 5 minutes before re-fetch
    refetchOnWindowFocus: true,    // Re-verify on tab focus
    retry: false,
  });
}
