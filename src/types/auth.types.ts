export interface LoginResponse {
  token: string;
  username: string;
  role: string; // this might be UserType
  message?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}
