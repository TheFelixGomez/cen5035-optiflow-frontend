import { create } from "zustand";
import { registerUser, login, getCurrentUser, type User} from "@/lib/api/auth";
type Role = "admin" | "customer";

function inferRole(username?: string): Role {
  const raw = import.meta.env.VITE_ADMIN_USERS as string | undefined;
  const admins = (raw ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  return username && admins.includes(username.toLowerCase()) ? "admin" : "customer";
}

type AuthState = {
  user: User | null;
  role: Role | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean; 
  login: (u: string, p: string) => Promise<void>;
  register: (u: string, p: string) => Promise<void>;
  logout: () => void;
  bootstrap: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  role: null,
  token: localStorage.getItem("of_token"),
  loading: false,
  error: null,
   isAuthenticated: !!localStorage.getItem("of_token"),

  bootstrap: async () => {
    const token = localStorage.getItem("of_token");
    if (!token) return;
    set({ loading: true });
    try {
      const user = await getCurrentUser();
      set({ user, role: inferRole(user.username), loading: false });
    } catch {
      localStorage.removeItem("of_token");
      set({ token: null, user: null, role: null, loading: false });
    }
  },

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const t = await login(username, password);
      localStorage.setItem("of_token", t.access_token);
      const user = await getCurrentUser();
      set({ token: t.access_token, user, role: inferRole(user.username), loading: false });
    } catch {
      set({ loading: false, error: "Invalid credentials" });
    }
  },

  register: async (username, password) => {
    set({ loading: true, error: null });
    try {
      await registerUser(username, password);
      await get().login(username, password);
    } catch {
      set({ loading: false, error: "Failed to register" });
    }
  },

  logout: () => {
    localStorage.removeItem("of_token");
    set({ user: null, token: null, role: null });
  },
}));
