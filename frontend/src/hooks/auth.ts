import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile,
} from "../services/auth";

import authHelper from "../utils/auth";

import type {
  LoginRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../types/auth";

/* =========================================================
   LOGIN
========================================================= */

export const useLogin = () => {
  return useMutation({
    mutationFn: (
      data: LoginRequest
    ) => login(data),
  });
};

/* =========================================================
   ADMIN PROFILE
========================================================= */

export const useAdminProfile = () => {
  const user = authHelper.getUser();

  const userId = user?.id;

  return useQuery({
    queryKey: [
      "admin-profile",
      userId,
    ],

    queryFn: () => {
      if (!userId) {
        throw new Error(
          "Admin user ID is missing"
        );
      }

      return getProfile(userId);
    },

    enabled:
      Boolean(userId) &&
      user?.role === "admin",
  });
};

/* =========================================================
   UPDATE ADMIN PROFILE
========================================================= */

export const useUpdateAdminProfile = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      adminId,
      data,
    }: {
      adminId: string;
      data: UpdateProfileRequest;
    }) => {
      return updateProfile(
        adminId,
        data
      );
    },

    onSuccess: async (response) => {
      /*
       * Update local logged-in user.
       */

      authHelper.updateUser(
        response.data
      );

      /*
       * Update React Query cache.
       */

      queryClient.setQueryData(
        [
          "admin-profile",
          response.data.id,
        ],
        response
      );

      /*
       * Refetch latest profile.
       */

      await queryClient.invalidateQueries({
        queryKey: [
          "admin-profile",
          response.data.id,
        ],
      });
    },
  });
};

/* =========================================================
   CHANGE PASSWORD
========================================================= */

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (
      data: ChangePasswordRequest
    ) => changePassword(data),
  });
};

/* =========================================================
   DELETE ADMIN PROFILE
========================================================= */

export const useDeleteAdminProfile = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      adminId: string
    ) => deleteProfile(adminId),

    onSuccess: () => {
      /*
       * Remove profile cache.
       */

      queryClient.removeQueries({
        queryKey: [
          "admin-profile",
        ],
      });

      /*
       * Clear authentication.
       */

      authHelper.clearAuth();
    },
  });
};