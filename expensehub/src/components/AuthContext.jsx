// src/pages/AuthContext.js
import { createContext, useContext } from "react";

// Hardcode employee token (employeeId:secret)
// Must match Django setting EMPLOYEE_API_SECRET ("supersecret123")
const AuthContext = createContext({ accessToken: "alice:supersecret123" });

export const AuthProvider = ({ children }) => {
  const auth = { accessToken: "alice:supersecret123" }; 
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
