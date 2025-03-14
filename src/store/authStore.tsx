import { create } from "zustand";

interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user") || "null") : null,

  setUser: (user) => {
    sessionStorage.setItem("user", JSON.stringify(user)); // Lưu vào sessionStorage
    set({ user });
  },

  logout: () => {
    sessionStorage.removeItem("user"); // Xóa session khi logout
    set({ user: null });
  },
}));
