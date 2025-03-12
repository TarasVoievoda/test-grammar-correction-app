"use client";

import React, { useState, useCallback, useEffect } from "react";

import { useRouter } from "next/navigation";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);

  const logout = useCallback(() => {
    setAccessToken(null);

    localStorage.removeItem("accessToken");

    router.push("/auth/sign-in");
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        setAccessToken(token);
      } else {
        router.push("/auth/sign-in");
      }
    }
  }, []);

  const login = (accessToken) => {
    setAccessToken(accessToken);

    localStorage.setItem("accessToken", accessToken);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: accessToken !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
