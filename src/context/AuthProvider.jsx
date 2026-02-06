import { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = AuthService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (loginRequest) => {
    try {
      const data = await AuthService.login(loginRequest);
      if (data.user) {
        setUser(data.user);
      }
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return AuthService.isAuthenticated();
  };

  const getCurrentUser = async () => {
    try {
      const data = await AuthService.getCurrentUser();
      if (data) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.error("Failed to get current user:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
