import type { UserResponse } from "../types";

const loginService = async (
  username: string,
  password: string,
): Promise<UserResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const dataWithJWT = await response.json();
    localStorage.setItem("jwt", dataWithJWT.token);

    const userResponse: UserResponse = await getCurrentUser();
    return userResponse;
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message || "Invalid credentials");
  }
};

const logoutService = () => {
  localStorage.removeItem("jwt");
};

const getCurrentUser = async (): Promise<UserResponse> => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const data = await response.json();
    return data as UserResponse;
  } else {
    throw new Error("Failed to fetch user information");
  }
};

export { loginService, logoutService, getCurrentUser };
