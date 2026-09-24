export type UserRole = "admin" | "user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: LoginData;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  status: number;
  message: string;
  data: {
    access_token: string;
    refresh_token?: string;
    token_type: string;
  };
}