import {
  Menu,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authHelper from "../utils/auth";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({
  onMenuClick,
}: AdminHeaderProps) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const user = authHelper.getUser();

  const userName = user?.name ?? "Admin";
  const userEmail = user?.email ?? "";

  const initial = userName
    .charAt(0)
    .toUpperCase();

  const handleProfile = () => {
    setOpen(false);
    navigate("/admin/profile");
  };

  const handleLogout = () => {
    setOpen(false);

    authHelper.clearAuth();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Admin Panel
          </h1>

          <p className="hidden text-xs text-gray-500 sm:block">
            Manage your blog
          </p>
        </div>
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-50"
        >
          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {initial}
          </div>

          {/* User info */}
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-gray-900">
              {userName}
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-gray-500"
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            
            {/* Profile information */}
            <div className="border-b border-gray-100 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                  {initial}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {userName}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="p-2">
              <button
                type="button"
                onClick={handleProfile}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={18} />

                <span>
                  Profile Management
                </span>
              </button>

              {/* <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/admin/change-password");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>Change Password</span>
              </button> */}

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />

                <span>
                  Logout
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;