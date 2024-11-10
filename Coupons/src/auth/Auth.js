import mockData from "../Data/MockData.json";
//user authenticator
export const authenticateUser = async (email, password) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = mockData.users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  throw new Error("Invalid credentials");
};
