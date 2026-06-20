import { create } from 'zustand';
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
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  /** Centralized logout: hit server then clear state [F-009] */
  logout: () => Promise<void>;
}

/**
 * Auth state WITHOUT persist.
 * Token is stored in httpOnly cookie (server-set, never accessible to JS) [F-002].
 * User object is kept in memory only for UI display.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  logout: async () => {
    try {
      await authService.logout(); // Hit POST /auth/logout — server blacklists token [F-009]
    } catch {
      // Proceed to clear local state even if server call fails
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
