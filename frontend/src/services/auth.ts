import apiClient from "../config/api/axios";

import authHelper from "../utils/auth";

import type {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  DeleteProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/auth";

/* =========================================================
   LOGIN
========================================================= */

export const login = async (
  data: LoginRequest
) => {
  const response =
    await apiClient.post<LoginResponse>(
      "/auth/login",
      data
    );

  authHelper.setAuth(
    response.data.data
  );

  return response.data;
};

/* =========================================================
   GET PROFILE
========================================================= */

export const getProfile = async (
  userId: string
) => {
  const response =
    await apiClient.get<ProfileResponse>(
      `/auth/fetch/${userId}`
    );

  return response.data;
};

/* =========================================================
   UPDATE PROFILE
========================================================= */

export const updateProfile = async (
  userId: string,
  data: UpdateProfileRequest
) => {
  const response =
    await apiClient.put<UpdateProfileResponse>(
      `/auth/update/${userId}`,
      data
    );

  return response.data;
};

/* =========================================================
   CHANGE PASSWORD
========================================================= */

export const changePassword = async (
  data: ChangePasswordRequest
) => {
  const response =
    await apiClient.put<ChangePasswordResponse>(
      "/auth/change-password",
      data
    );

  return response.data;
};

/* =========================================================
   DELETE PROFILE
========================================================= */

export const deleteProfile = async (
  userId: string
) => {
  const response =
    await apiClient.delete<DeleteProfileResponse>(
      `/auth/delete/${userId}`
    );

  return response.data;
};

/* =========================================================
   LOGOUT
========================================================= */

export const logout = () => {
  authHelper.clearAuth();
};