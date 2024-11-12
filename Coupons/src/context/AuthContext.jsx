import { createContext, useContext, useState, useEffect } from "react";
import { checkAuth, authenticateUser, logout } from "../auth/Auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on load
    const user = checkAuth();
    setUser(user);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const user = await authenticateUser(email, password);
    setUser(user);
    return user;
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout: logoutUser,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
