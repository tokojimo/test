import React, { createContext, useContext, useState } from "react";

interface User {
  username: string;
  premium: boolean;
}

interface AuthContextValue {
  user: User | null;
  login: (u: string, p: string) => boolean;
  signup: (u: string, p: string) => boolean;
  loginWithProvider: (p: "google" | "apple") => void;
  logout: () => void;
  upgrade: () => void;
}

function safeParse<T>(data: string, fallback: T): T {
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    console.warn("Failed to parse JSON:", e);
    return fallback;
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? safeParse<User | null>(stored, null) : null;
  });

  const login = (username: string, password: string) => {
    const users = safeParse<Record<string, { password: string; premium: boolean }>>(
      localStorage.getItem("users") || "{}",
      {}
    );
    const record = users[username];
    if (record && record.password === password) {
      const u: User = { username, premium: !!record.premium };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const signup = (username: string, password: string) => {
    const users = safeParse<Record<string, { password: string; premium: boolean }>>(
      localStorage.getItem("users") || "{}",
      {}
    );
    if (users[username]) return false;
    users[username] = { password, premium: false };
    localStorage.setItem("users", JSON.stringify(users));
    const u: User = { username, premium: false };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    return true;
  };

  const loginWithProvider = (provider: "google" | "apple") => {
    const users = safeParse<Record<string, { password: string; premium: boolean }>>(
      localStorage.getItem("users") || "{}",
      {}
    );
    if (!users[provider]) {
      users[provider] = { password: "", premium: false };
      localStorage.setItem("users", JSON.stringify(users));
    }
    const u: User = { username: provider, premium: !!users[provider].premium };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const upgrade = () => {
    if (!user) return;
    const u = { ...user, premium: true };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    const users = safeParse<Record<string, { password: string; premium: boolean }>>(
      localStorage.getItem("users") || "{}",
      {}
    );
    if (users[user.username]) {
      users[user.username].premium = true;
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithProvider, logout, upgrade }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

