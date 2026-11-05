import React, { createContext, useContext, useState, useEffect } from "react";
import { generateId } from "../utils/helpers";

const AuthContext = createContext(null);

const DEMO_ACCOUNTS = {
  "donor@demo.com": {
    password: "demo1234",
    role: "donor",
    name: "Demo Donor",
    id: "DEMO_DONOR_001",
    bloodGroup: "O+",
    city: "Mangaluru",
    age: 28,
    phone: "+91 90000 00001",
    available: true,
    donationCount: 5,
    lastDonation: "2024-08-01",
  },
  "recipient@demo.com": {
    password: "demo1234",
    role: "recipient",
    name: "Demo Recipient",
    id: "DEMO_RECIP_001",
    bloodGroup: "A+",
    city: "Mangaluru",
    age: 35,
    phone: "+91 90000 00002",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ld_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const acc = DEMO_ACCOUNTS[email.toLowerCase()];
    if (acc && acc.password === password) {
      const { password: _, ...userData } = acc;
      const u = { ...userData, email };
      setUser(u);
      localStorage.setItem("ld_user", JSON.stringify(u));
      return { success: true, user: u };
    }
    // Check registered users
    const registered = JSON.parse(localStorage.getItem("ld_registered") || "[]");
    const found = registered.find(r => r.email.toLowerCase() === email.toLowerCase() && r.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem("ld_user", JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: "Invalid email or password." };
  };

  const register = async (data) => {
    const registered = JSON.parse(localStorage.getItem("ld_registered") || "[]");
    if (registered.find(r => r.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "Email already registered." };
    }
    const newUser = {
      ...data,
      id: generateId(data.role === "donor" ? "DONOR" : "RECIP"),
      donationCount: 0,
      available: true,
      createdAt: new Date().toISOString(),
    };
    registered.push(newUser);
    localStorage.setItem("ld_registered", JSON.stringify(registered));
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem("ld_user", JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ld_user");
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("ld_user", JSON.stringify(updated));
    // Also update in registered list
    const registered = JSON.parse(localStorage.getItem("ld_registered") || "[]");
    const idx = registered.findIndex(r => r.id === user.id);
    if (idx !== -1) {
      registered[idx] = { ...registered[idx], ...updates };
      localStorage.setItem("ld_registered", JSON.stringify(registered));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
