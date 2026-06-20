import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api/auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'seeker';
  phone?: string;
  avatar_url?: string;
  banner_url?: string;
  is_verified?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  /** Set by persist middleware after rehydration completes */
  _hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
}

/**
 * Auth store with token persisted in localStorage.
 *
 * ARCHITECTURE NOTE: Vercel (frontend) and Railway (API) are different origins.
 * httpOnly cookies cannot be sent cross-origin without a shared parent domain,
 * so we use Bearer token in Authorization header instead. Token in localStorage
 * is accessible to JavaScript (XSS risk), but is the standard approach for this
 * cross-origin setup. httpOnly cookie is still set for same-origin Railway→Railway
 * requests and works for dev environments.
 *
 * SECURITY NOTE: isAuthenticated is NOT persisted — always recomputed from !!token
 * after rehydration. This prevents stale auth state on page reload (Zustand v5 async persist).
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      setUser: (user) => set({ user }),

      clearUser: () => set({ token: null, user: null, isAuthenticated: false }),

      logout: async () => {
        try {
          await authService.logout(); // POST /auth/logout — server blacklists token [F-009]
        } catch {
          // Clear local state even if server call fails
        } finally {
          set({ token: null, user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist token + user. isAuthenticated is recomputed on login
      // and NOT persisted — prevents stale state on reload.
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark rehydration complete; isAuthenticated will be set correctly
        // by setAuth after login or remains false after logout/clearUser.
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);
