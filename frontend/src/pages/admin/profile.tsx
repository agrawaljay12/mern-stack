import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  Pencil,
  ArrowLeft,
  Trash2,
  X,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  profileSchema,
  type ProfileFormData,
} from "../../schema/auth";

import {
  useAdminProfile,
  useUpdateAdminProfile,
  useDeleteAdminProfile,
} from "../../hooks/auth";

const Profile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const {
    data,
    isLoading,
    isError,
  } = useAdminProfile();

  const updateProfile =
    useUpdateAdminProfile();

  const deleteProfile =
    useDeleteAdminProfile();

  const profile = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        age: profile.age,
      });
    }
  }, [profile, reset]);

  /* =========================================
     LOADING
  ========================================= */

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (isError || !profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">
            Unable to load profile.
          </p>

          <Link
            to="/admin"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================
     SUBMIT
  ========================================= */

  const onSubmit = (
    formData: ProfileFormData
  ) => {
    updateProfile.mutate(
      {
        adminId: profile.id,
        data: formData,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDeleteProfile = () => {
    deleteProfile.mutate(profile.id, {
      onSuccess: () => {
        navigate("/login", {
          replace: true,
        });
      },
    });
  };

  const initial = profile.name
    .charAt(0)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="mb-6">
        <Link
          to="/admin"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your administrator account.
        </p>
      </div>

      {/* =====================================
          PROFILE HEADER
      ===================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="h-32 bg-blue-600" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-3xl font-bold text-blue-600 shadow-sm">
                {initial}
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {profile.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isEditing) {
                  reset({
                    name: profile.name,
                    email: profile.email,
                    age: profile.age,
                  });
                }

                setIsEditing(
                  (value) => !value
                );
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {isEditing ? (
                <X size={16} />
              ) : (
                <Pencil size={16} />
              )}

              {isEditing
                ? "Cancel"
                : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================
          INFORMATION
      ===================================== */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your administrator account details.
              </p>
            </div>

            {!isEditing ? (
              <div className="space-y-5">
                {/* Name */}
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <User
                      size={18}
                      className="text-gray-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Name
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {profile.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <Mail
                      size={18}
                      className="text-gray-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Email
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {/* Age */}
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <User
                      size={18}
                      className="text-gray-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Age
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {profile.age ?? "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <ShieldCheck
                      size={18}
                      className="text-gray-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Role
                    </p>

                    <span className="mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600">
                      {profile.role}
                    </span>
                  </div>
                </div>

                {/* Account ID */}
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <User
                      size={18}
                      className="text-gray-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Account ID
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {profile.id}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Name */}
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
                    {...register("name")}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
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
                    {...register("email")}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Age */}
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
                    {...register("age", {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {errors.age && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.age.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      reset({
                        name: profile.name,
                        email: profile.email,
                        age: profile.age,
                      });

                      setIsEditing(false);
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      updateProfile.isPending
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updateProfile.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ===================================
            SECURITY
        =================================== */}

        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Lock
                  size={19}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Security
                </h2>

                <p className="text-xs text-gray-500">
                  Manage account security
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/admin/profile/change-password"
                className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-900">
                  Change Password
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Update your account password.
                </p>
              </Link>

              {/* Delete */}
              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(true)
                }
                className="flex w-full items-center gap-3 rounded-lg border border-red-200 p-4 text-left hover:bg-red-50"
              >
                <Trash2
                  size={18}
                  className="text-red-500"
                />

                <div>
                  <p className="text-sm font-medium text-red-600">
                    Delete Account
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Permanently delete your admin
                    account.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          DELETE MODAL
      ===================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Account?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone. Your
              administrator account will be permanently
              deleted.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProfile}
                disabled={
                  deleteProfile.isPending
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {deleteProfile.isPending
                  ? "Deleting..."
                  : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;