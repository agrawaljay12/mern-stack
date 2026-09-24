import {
  Navigate,
  Outlet,
} from "react-router-dom";

import authHelper from "../utils/auth";

import type {
  UserRole,
} from "../types/auth";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

const RoleRoute = ({
  allowedRoles,
}: RoleRouteProps) => {
  const user =
    authHelper.getUser();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};

export default RoleRoute;