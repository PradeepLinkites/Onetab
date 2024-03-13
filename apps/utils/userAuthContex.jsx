import React, { createContext, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ childern, value }) => {
  return <AuthContext.Provider value={value}>{childern}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
