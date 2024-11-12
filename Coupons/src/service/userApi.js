// src/services/userApi.js

// Mock data storage
let users = [
  {
    id: 1,
    name: "Beni",
    email: "Beni@gmail.com",
    role: "admin",
    couponsCreated: 5,
    lastActive: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Guest User",
    email: "guest@gmail.com",
    role: "user",
    couponsCreated: 2,
    lastActive: new Date().toISOString(),
  },
];

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const userApi = {
  // Get all users
  getAll: async () => {
    await delay(500);
    return [...users];
  },

  // Create new user
  create: async (userData) => {
    await delay(500);

    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error("Missing required fields");
    }

    // Validate email format
    if (!userData.email.includes("@")) {
      throw new Error("Invalid email format");
    }

    // Check if email already exists
    if (
      users.some(
        (user) => user.email.toLowerCase() === userData.email.toLowerCase()
      )
    ) {
      throw new Error("Email already exists");
    }

    // Create new user
    const newUser = {
      id: Math.max(0, ...users.map((u) => u.id)) + 1,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      couponsCreated: 0,
      lastActive: new Date().toISOString(),
    };

    users = [...users, newUser];
    return newUser;
  },

  // Update user
  update: async (id, userData) => {
    await delay(500);

    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }

    // Check email uniqueness if email is being changed
    if (
      userData.email &&
      userData.email !== users[index].email &&
      users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())
    ) {
      throw new Error("Email already exists");
    }

    const updatedUser = {
      ...users[index],
      ...userData,
      id, // Ensure ID doesn't change
      lastActive: new Date().toISOString(),
    };

    users = [...users.slice(0, index), updatedUser, ...users.slice(index + 1)];

    return updatedUser;
  },

  // Delete user
  delete: async (id) => {
    await delay(500);

    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }

    users = users.filter((u) => u.id !== id);
    return true;
  },
};

export default userApi;
