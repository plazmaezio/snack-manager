import type { LoginResponse, UserRequest, UserResponse } from "../types";
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
    if (
      err instanceof Error &&
      (err as any).status >= 400 &&
      (err as any).status < 500
    ) {
      throw new Error("Invalid credentials");
    }
    throw new Error(
      err instanceof Error ? err.message : "Something went wrong",
    );
  }
};

const createAccountService = async (
  userData: UserRequest,
): Promise<UserResponse> => {
  if (!userData.username || !userData.password || !userData.type) {
    throw new Error("All fields are required");
  }

  if (userData.balance === undefined || userData.balance < 0) {
    userData.balance = 0;
  }

  try {
    return await api.post<UserResponse>("/users", userData);
  } catch (err) {
    if (err instanceof Error && (err as any).status === 400) {
      throw new Error("Username already taken");
    }
    throw new Error("Failed to create user");
  }
};

const logoutService = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("cart");
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

export { loginService, logoutService, getCurrentUser, createAccountService };
