export const userTypeOptions = {
  EMPLOYEE: "Employee",
  CLIENT: "Client",
  ADMIN: "Admin"
} as const;
export type UserType = keyof typeof userTypeOptions;

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
