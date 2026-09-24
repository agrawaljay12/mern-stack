import apiClient from "../config/api/axios";
import authHelper from "../utils/auth";

import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  DeleteProfileResponse,
} from "../types/auth";

/* =========================================
   LOGIN
========================================= */

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/users/login",
    data
  );

  authHelper.setAuth(response.data.data);

  return response.data;
};

/* =========================================
   REFRESH TOKEN
========================================= */

export const refreshToken = async (
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  const response =
    await apiClient.post<RefreshTokenResponse>(
      "/users/refresh",
      data
    );

  return response.data;
};

/* =========================================
   LOGOUT
========================================= */

export const logout = (): void => {
  authHelper.clearAuth();
};

/* =========================================
   ADMIN PROFILE
========================================= */

/**
 * Get admin profile
 *
 * GET /users/fetch/:id
 */
export const getAdminProfile = async (
  adminId: number
): Promise<ProfileResponse> => {
  const response =
    await apiClient.get<ProfileResponse>(
      `/users/fetch/${adminId}`
    );

  return response.data;
};

/**
 * Update admin profile
 *
 * PUT /users/update/:id
 */
export const updateAdminProfile = async (
  adminId: number,
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  const response =
    await apiClient.put<UpdateProfileResponse>(
      `/users/update/${adminId}`,
      data
    );

  return response.data;
};

/**
 * Delete admin account
 *
 * DELETE /users/delete/:id
 */
export const deleteAdminProfile = async (
  adminId: number
): Promise<DeleteProfileResponse> => {
  const response =
    await apiClient.delete<DeleteProfileResponse>(
      `/users/delete/${adminId}`
    );

  return response.data;
};