"use client";

import { useEffect, useState } from "react";
import { getStoredToken, clearAuthSession } from "@/stellar/auth";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = getStoredToken();
    const savedAddress = localStorage.getItem("solfa_auth_address");
    setToken(savedToken);
    setUserAddress(savedAddress);
    setIsLoading(false);
  }, []);

  const logout = () => {
    clearAuthSession();
    setToken(null);
    setUserAddress(null);
  };

  const setAuthData = (newToken: string, address: string) => {
    setToken(newToken);
    setUserAddress(address);
    localStorage.setItem("solfa_jwt_token", newToken);
    localStorage.setItem("solfa_auth_address", address);
  };

  return {
    token,
    userAddress,
    isAuthenticated: Boolean(token),
    isLoading,
    setAuthData,
    logout,
  };
}
