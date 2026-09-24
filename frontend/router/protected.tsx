import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

interface AdminRouteProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AdminRoute = ({
  isAuthenticated,
  isAdmin,
}: AdminRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};

export default AdminRoute;