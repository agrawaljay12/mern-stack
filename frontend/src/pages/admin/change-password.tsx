import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { changePasswordSchema, type ChangePasswordFormData } from "../../schema/auth";
import { useChangePassword } from "../../hooks/auth";

const ChangePassword = () => {
  const navigate = useNavigate();
  const mutation = useChangePassword();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (values: ChangePasswordFormData) => {
    mutation.mutate({ currentPassword: values.currentPassword, newPassword: values.newPassword }, { onSuccess: () => reset() });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="mt-1 text-sm text-gray-500">Update your admin account password.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => (
            <div key={field}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}
              </label>
              <input type="password" {...register(field)} className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]?.message}</p>}
            </div>
          ))}
          {mutation.isError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{mutation.error instanceof Error ? mutation.error.message : "Failed to change password."}</div>}
          {mutation.isSuccess && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">Password changed successfully.</div>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate("/admin/profile")} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700">Back to Profile</button>
            <button type="submit" disabled={mutation.isPending} className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">{mutation.isPending ? "Changing..." : "Change Password"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
