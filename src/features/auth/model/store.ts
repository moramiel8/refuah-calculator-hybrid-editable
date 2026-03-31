import { create } from "zustand";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  email: string;
  isStudent: boolean;
  isAdmin: boolean;
  avatarUrl: string | null;
  isEmailPrivate: boolean;
  hideLastSeen: boolean;
  primaryRole: string;
  role: string;
  badges: string[];
  permissions: string[];
  bannedAt: string | null;
  emailNotifications: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  setUser: (user) =>
    set({ user, isAuthenticated: !!user, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, isAuthenticated: false, loading: false }),
}));
