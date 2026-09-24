import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import authHelper from "../utils/auth";

const ProtectedRoute = () => {
  const location = useLocation();

  const token =
    authHelper.getAccessToken();

  const user =
    authHelper.getUser();

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;