// auth/Auth.js
import mockData from "../Data/MockData.json";

// Simple hash function for demo purposes
// In production, use proper authentication with backend
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
};

export const authenticateUser = async (email, password) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find user and compare credentials
  const user = mockData.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (user && simpleHash(password) === simpleHash(user.password)) {
    // Don't send password to frontend
    const { password: _, ...userWithoutPassword } = user;

    // Create a simple session token
    const token = btoa(
      JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      })
    );

    // Store in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  }

  throw new Error("Invalid credentials");
};

export const checkAuth = () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    const decoded = JSON.parse(atob(token));
    if (decoded.exp < Date.now()) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return null;
    }

    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};
