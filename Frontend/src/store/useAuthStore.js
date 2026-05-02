import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/auth.service';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      tenant: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const data = await authService.login(credentials);
        set({
          user: data.user,
          tenant: data.tenant,
          token: data.token,
          isAuthenticated: true,
        });
        return data;
      },

      signup: async (userData) => {
        const data = await authService.businessSignup(userData);
        set({
          user: data.user,
          tenant: data.tenant,
          token: data.token,
          isAuthenticated: true,
        });
        return data;
      },

      logout: () => {
        authService.logout();
        set({ user: null, tenant: null, token: null, isAuthenticated: false });
      },

      getTenantId: () => {
        const { tenant } = get();
        return tenant?._id || tenant?.id || tenant?.slug || '';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tenant: state.tenant,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
