import type { UserType } from "./user.types";

export interface LoginResponse {
  token: string;
  username: string;
  role: UserType;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}
