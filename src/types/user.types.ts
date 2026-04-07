export type UserType = "EMPLOYEE" | "CLIENT" | "ADMIN";

export interface UserResponse {
  readonly id: string;
  username: string;
  type: UserType;
  balance?: number;
}

export interface UserRequest {
  username: string;
  password: string;
  type: UserType;
  balance?: number;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: UserType;
  message: string;
}
