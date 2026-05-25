import { api } from "../../../shared/services/api";
import type {
  UserRequest,
  UserResponse,
} from "../../auth/types";

export type UserUpdateRequest = Omit<UserRequest, "password"> & {
  password?: string;
};



export const fetchUsersService = async (): Promise<UserResponse[]> => {
  return await api.get<UserResponse[]>("/users");
};

export const createUserService = async (
  userData: UserRequest,
): Promise<UserResponse> => {
  return await api.post<UserResponse>("/users", userData);
};

export const updateUserService = async (
  userId: string,
  userData: UserUpdateRequest,
): Promise<UserResponse> => {
  return await api.put<UserResponse>(`/users/${userId}`, userData);
};

export const updateProfileService = async (
  userData: UserUpdateRequest,
): Promise<UserResponse> => {
  return await api.put<UserResponse>(`/users/me`, userData);
};
export const deleteUserService = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};