import apiClient from "../config/api/axios";

import authHelper from "../utils/auth";

import type {
  LoginRequest,
  LoginResponse,
} from "../types/auth";

export const login = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/users/login",
    data,
  );

  authHelper.setAuth(response.data.data);

  return response.data;
};