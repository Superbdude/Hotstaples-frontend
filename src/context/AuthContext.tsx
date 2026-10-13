import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

export type ApiUser = { id: string; email: string; fullName: string; phone: string; role: string; addresses: string[]; wishlist: string[] };
type AuthValue = {
  user: { id: string; email: string } | null;
  profile: { id: string; email: string; full_name: string; phone: string; avatar_url: string | null } | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  updateProfile: (patch: { full_name?: string; phone?: string }) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const C = createContext<AuthValue | undefined>(undefined);
const TOKEN_KEY = "hotstaple_token";

function toProfile(u: ApiUser) {
  return { id: u.id, email: u.email, full_name: u.fullName || "", phone: u.phone || "", avatar_url: null as string | null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    api<{ user: ApiUser }>("/api/auth/me", { token })
      .then(({ user }) => setApiUser(user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const signUp: AuthValue["signUp"] = async (email, password, fullName) => {
    const { token, user } = await api<{ token: string; user: ApiUser }>("/api/auth/register", { body: { email, password, fullName } });
    localStorage.setItem(TOKEN_KEY, token);
    setApiUser(user);
  };

  const signIn: AuthValue["signIn"] = async (email, password) => {
    const { token, user } = await api<{ token: string; user: ApiUser }>("/api/auth/login", { body: { email, password } });
    localStorage.setItem(TOKEN_KEY, token);
    setApiUser(user);
  };

  const updateProfile: AuthValue["updateProfile"] = async (patch) => {
    const { user } = await api<{ user: ApiUser }>("/api/auth/me", {
      method: "PATCH",
      body: { fullName: patch.full_name, phone: patch.phone },
    });
    setApiUser(user);
  };

  const updatePassword: AuthValue["updatePassword"] = async (password) => {
    await api("/api/auth/change-password", { body: { password } });
  };

  const refreshProfile = async () => {
    try {
      const { user } = await api<{ user: ApiUser }>("/api/auth/me");
      setApiUser(user);
    } catch { /* signed out */ }
  };

  const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setApiUser(null);
  };

  const value = useMemo<AuthValue>(() => ({
    user: apiUser ? { id: apiUser.id, email: apiUser.email } : null,
    profile: apiUser ? toProfile(apiUser) : null,
    isAdmin: apiUser?.role === "admin",
    loading, signUp, signIn, updateProfile, updatePassword, refreshProfile, signOut,
  }), [apiUser, loading]);
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useAuth() {
  const v = useContext(C);
  if (!v) throw new Error("AuthProvider missing");
  return v;
}
