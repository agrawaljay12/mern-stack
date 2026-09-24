import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  login,
  getAdminProfile,
  updateAdminProfile,
  deleteAdminProfile,
} from "../services/auth";

import authHelper from "../utils/auth";

import type {
  LoginRequest,
  UpdateProfileRequest,
} from "../types/auth";

/* =========================================
   LOGIN
========================================= */

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      login(data),
  });
};

/* =========================================
   GET ADMIN PROFILE
========================================= */

export const useAdminProfile = () => {
  const user = authHelper.getUser();

  return useQuery({
    queryKey: ["admin-profile", user?.id],

    queryFn: () => {
      if (!user?.id) {
        throw new Error(
          "Admin user is not authenticated"
        );
      }

      return getAdminProfile(user.id);
    },

    enabled:
      Boolean(user?.id) &&
      user?.role === "admin",
  });
};

/* =========================================
   UPDATE ADMIN PROFILE
========================================= */

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      adminId,
      data,
    }: {
      adminId: number;
      data: UpdateProfileRequest;
    }) =>
      updateAdminProfile(adminId, data),

    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        ["admin-profile", variables.adminId],
        response
      );

      queryClient.invalidateQueries({
        queryKey: [
          "admin-profile",
          variables.adminId,
        ],
      });
    },
  });
};

/* =========================================
   DELETE ADMIN PROFILE
========================================= */

export const useDeleteAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: number) =>
      deleteAdminProfile(adminId),

    onSuccess: (_, adminId) => {
      queryClient.removeQueries({
        queryKey: [
          "admin-profile",
          adminId,
        ],
      });

      authHelper.clearAuth();
    },
  });
};