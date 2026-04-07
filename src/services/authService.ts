import type { LoginResponse, UserResponse } from "../types";
import { api } from "./api";

const loginService = async (
  username: string,
  password: string,
): Promise<UserResponse> => {
  try {
    const { token } = await api.post<LoginResponse>("/auth/login", {
      username,
      password,
    });
    localStorage.setItem("jwt", token);

    return await getCurrentUser();
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Invalid credentials");
  }
};

const logoutService = () => {
  localStorage.removeItem("jwt");
};

const getCurrentUser = async (): Promise<UserResponse> => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  try {
    return await api.get<UserResponse>("/users/me");
  } catch (err) {
    logoutService();
    throw new Error("Failed to fetch user information");
  }
};

export { loginService, logoutService, getCurrentUser };
