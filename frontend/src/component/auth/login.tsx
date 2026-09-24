import { useState, type FormEvent } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  loginSchema,
  type LoginFormData,
} from "../../schema/auth";

import { useLogin } from "../../hooks/auth";

import authHelper from "../../utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useLogin();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const getDefaultRoute = (
    role: "admin" | "user",
  ) => {
    switch (role) {
      case "admin":
        return "/admin";

      case "user":
        return "/user/collections";

      default:
        return "/";
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const nextErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData;
        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const data = result.data;
    loginMutation.mutate(data, {
      onSuccess: () => {
        const user = authHelper.getUser();

        if (!user) {
          return;
        }

        const from =
          location.state?.from?.pathname;

        navigate(
          from ??
            getDefaultRoute(user.role),
          {
            replace: true,
          },
        );

        setFormData({ email: "", password: "" });
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to your account
            </p>
          </div>

          {loginMutation.isError && (
            <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              Invalid email or password.
            </div>
          )}

          {loginMutation.isSuccess && (
            <div className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-600">
              Login successful.
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="space-y-5"
          >

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
                placeholder="Enter your email"
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(event) =>
                  setFormData({ ...formData, password: event.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;