"use client";

import React, { createContext, useContext } from "react";
import { useAuth } from "../hooks/use-auth";
import { AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useSharedAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSharedAuth must be used within an AuthProvider");
  }
  return context;
}
