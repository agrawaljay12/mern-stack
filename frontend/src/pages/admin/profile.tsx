import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useNavigate,
} from "react-router-dom";

import {
  profileSchema,
  changePasswordSchema,
  type ProfileFormData,
  type ChangePasswordFormData,
} from "../../schema/auth";

import {
  useAdminProfile,
  useUpdateAdminProfile,
  useChangePassword,
  useDeleteAdminProfile,
} from "../../hooks/auth";

import authHelper from "../../utils/auth";

const Profile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  /* =======================================================
     CURRENT USER
  ======================================================= */

  const user = authHelper.getUser();

  /* =======================================================
     PROFILE QUERY
  ======================================================= */

  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdminProfile();

  /* =======================================================
     MUTATIONS
  ======================================================= */

  const updateMutation =
    useUpdateAdminProfile();

  const passwordMutation =
    useChangePassword();

  const deleteMutation =
    useDeleteAdminProfile();

  /* =======================================================
     PROFILE FORM
  ======================================================= */

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: {
      errors: profileErrors,
    },
  } = useForm<ProfileFormData>({
    resolver:
      zodResolver(profileSchema),

    defaultValues: {
      name: "",
      email: "",
      age: 18,
    },
  });

  /* =======================================================
     PASSWORD FORM
  ======================================================= */

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: {
      errors: passwordErrors,
    },
  } = useForm<ChangePasswordFormData>({
    resolver:
      zodResolver(
        changePasswordSchema
      ),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    resetProfile({
      name: data.data.name,
      email: data.data.email,
      age: data.data.age,
    });
  }, [
    data,
    resetProfile,
  ]);

  /* =======================================================
     NO USER
  ======================================================= */

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [
    user,
    navigate,
  ]);

  /* =======================================================
     UPDATE PROFILE
  ======================================================= */

  const onProfileSubmit = (
    values: ProfileFormData
  ) => {
    if (!user?.id) {
      return;
    }

    updateMutation.mutate({
      adminId: user.id,

      data: {
        name: values.name,
        email: values.email,
        age: values.age,
      },
    });
  };

  /* =======================================================
     PROFILE UPDATE SUCCESS
  ======================================================= */

  useEffect(() => {
    if (
      updateMutation.isSuccess &&
      updateMutation.data?.data
    ) {
      setIsEditing(false);

      resetProfile({
        name:
          updateMutation.data.data.name,

        email:
          updateMutation.data.data.email,

        age:
          updateMutation.data.data.age,
      });
    }
  }, [
    updateMutation.isSuccess,
    updateMutation.data,
    resetProfile,
  ]);

  /* =======================================================
     CHANGE PASSWORD
  ======================================================= */

  const onPasswordSubmit = (
    values: ChangePasswordFormData
  ) => {
    passwordMutation.mutate(
      {
        currentPassword:
          values.currentPassword,

        newPassword:
          values.newPassword,
      },
      {
        onSuccess: () => {
          resetPassword();
        },
      }
    );
  };

  /* =======================================================
     DELETE ACCOUNT
  ======================================================= */

  const handleDelete = () => {
    if (!user?.id) {
      return;
    }

    deleteMutation.mutate(
      user.id,
      {
        onSuccess: () => {
          setShowDeleteModal(false);

          navigate("/login", {
            replace: true,
          });
        },
      }
    );
  };

  /* =======================================================
     NO USER
  ======================================================= */

  if (!user) {
    return null;
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Failed to load profile
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Something went wrong."}
          </p>
        </div>
      </div>
    );
  }

  const profile = data?.data;

  if (!profile) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Profile not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-6">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your admin account.
          </p>
        </div>

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-200 p-6">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your account information.
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  updateMutation.reset();

                  resetProfile({
                    name: profile.name,
                    email: profile.email,
                    age: profile.age,
                  });

                  setIsEditing(true);
                }}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Edit
              </button>
            )}

          </div>

          <div className="p-6">

            {isEditing ? (

              <form
                onSubmit={handleProfileSubmit(
                  onProfileSubmit
                )}
                className="space-y-5"
              >

                {/* NAME */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    {...registerProfile("name")}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {
                        profileErrors.name
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    {...registerProfile("email")}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {
                        profileErrors.email
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* AGE */}

                <div>
                  <label
                    htmlFor="age"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Age
                  </label>

                  <input
                    id="age"
                    type="number"
                    {...registerProfile("age", {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {profileErrors.age && (
                    <p className="mt-1 text-sm text-red-500">
                      {
                        profileErrors.age
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* ERROR */}

                {updateMutation.isError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {updateMutation.error instanceof Error
                      ? updateMutation.error.message
                      : "Failed to update profile."}
                  </div>
                )}

                {/* SUCCESS */}

                {updateMutation.isSuccess && (
                  <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                    Profile updated successfully.
                  </div>
                )}

                {/* BUTTONS */}

                <div className="flex gap-3">

                  <button
                    type="submit"
                    disabled={
                      updateMutation.isPending
                    }
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updateMutation.isPending
                      ? "Updating..."
                      : "Update Profile"}
                  </button>

                  <button
                    type="button"
                    disabled={
                      updateMutation.isPending
                    }
                    onClick={() => {
                      setIsEditing(false);

                      updateMutation.reset();

                      resetProfile({
                        name: profile.name,
                        email: profile.email,
                        age: profile.age,
                      });
                    }}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              <div className="space-y-6">

                {/* NAME */}

                <div>
                  <p className="text-sm text-gray-500">
                    Name
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {profile.name}
                  </p>
                </div>

                {/* EMAIL */}

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {profile.email}
                  </p>
                </div>

                {/* AGE */}

                <div>
                  <p className="text-sm text-gray-500">
                    Age
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {profile.age}
                  </p>
                </div>

                {/* ROLE */}

                <div>
                  <p className="text-sm text-gray-500">
                    Role
                  </p>

                  <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {profile.role}
                  </span>
                </div>

                {/* ID */}

                <div>
                  <p className="text-sm text-gray-500">
                    Account ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-gray-600">
                    {profile.id}
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* =================================================
            CHANGE PASSWORD
        ================================================= */}

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 p-6">

            <h2 className="text-lg font-semibold text-gray-900">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your account password.
            </p>

          </div>

          <div className="p-6">

            <form
              onSubmit={handlePasswordSubmit(
                onPasswordSubmit
              )}
              className="space-y-5"
            >

              {/* CURRENT PASSWORD */}

              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>

                <input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  {...registerPassword(
                    "currentPassword"
                  )}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {
                      passwordErrors
                        .currentPassword
                        .message
                    }
                  </p>
                )}
              </div>

              {/* NEW PASSWORD */}

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  {...registerPassword(
                    "newPassword"
                  )}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {
                      passwordErrors
                        .newPassword
                        .message
                    }
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...registerPassword(
                    "confirmPassword"
                  )}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {
                      passwordErrors
                        .confirmPassword
                        .message
                    }
                  </p>
                )}
              </div>

              {/* SERVER ERROR */}

              {passwordMutation.isError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {passwordMutation.error instanceof Error
                    ? passwordMutation.error.message
                    : "Failed to change password."}
                </div>
              )}

              {/* SUCCESS */}

              {passwordMutation.isSuccess && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                  Password changed successfully.
                </div>
              )}

              {/* BUTTON */}

              <div className="flex justify-end">

                <button
                  type="submit"
                  disabled={
                    passwordMutation.isPending
                  }
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {passwordMutation.isPending
                    ? "Changing Password..."
                    : "Change Password"}
                </button>

              </div>

            </form>

          </div>
        </div>

        {/* =================================================
            DELETE ACCOUNT
        ================================================= */}

        <div className="rounded-xl border border-red-200 bg-white shadow-sm">

          <div className="p-6">

            <h2 className="text-lg font-semibold text-red-600">
              Delete Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Permanently delete your admin account.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowDeleteModal(true)
              }
              className="mt-4 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete Account
            </button>

          </div>
        </div>

      </div>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <h2 className="text-lg font-semibold text-gray-900">
              Delete Account?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to permanently
              delete your admin account? This action
              cannot be undone.
            </p>

            {deleteMutation.isError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {deleteMutation.error instanceof Error
                  ? deleteMutation.error.message
                  : "Failed to delete account."}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                disabled={
                  deleteMutation.isPending
                }
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  deleteMutation.isPending
                }
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Profile;