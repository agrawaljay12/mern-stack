import { Link, useNavigate } from "react-router-dom";
import authHelper from "../utils/auth";

const PublicHeader = () => {
  const navigate = useNavigate();
  const user = authHelper.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-black tracking-tight text-slate-900">
          Blog<span className="text-blue-600">Manager</span>
        </Link>

        <div className="flex items-center gap-3">
          {user?.role === "admin" ? (
            <button
              onClick={() => navigate("/admin")}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Admin Dashboard
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
