export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: UserRole;
}

/* =========================================================
   LOGIN
========================================================= */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  name: string;
  email: string;
  age: number;
  role: UserRole;
}

export interface LoginData {
  access_token: string;
  result: LoginUser;
  token_type: "Bearer";
}

export interface LoginResponse {
  success?: boolean;
  message: string;
  data: LoginData;
}

/* =========================================================
   REFRESH TOKEN
========================================================= */

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  success?: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token?: string;
    token_type: "Bearer";
  };
}

/* =========================================================
   PROFILE
========================================================= */

export interface Profile {
  id: string;
  name: string;
  email: string;
  age: number;
  role: UserRole;
}

export interface ProfileResponse {
  success?: boolean;
  message: string;
  data: Profile;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  age: number;
}

export interface UpdateProfileResponse {
  success?: boolean;
  message: string;
  data: Profile;
}

export interface DeleteProfileResponse {
  success?: boolean;
  message: string;
  data: Profile | null;
}

/* =========================================================
   CHANGE PASSWORD
========================================================= */

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success?: boolean;
  message: string;
  data: null;
}