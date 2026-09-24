import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// ================================
// Public Pages
// ================================

import Home from "./pages/blogdetail";
import BlogDetails from "./pages/blogdetail";

import Login from "./pages/auth/login";

// ================================
// Admin Pages
// ================================

import Dashboard from "./pages/admin/dashboard";
import AdminBlogs from "./pages/admin/adminblog";
import CreateBlog from "./pages/admin/createblog";
import EditBlog from "./pages/admin/editblog";
import Profile from "./pages/admin/profile";

// ================================
// Admin Layout
// ================================

import AdminLayout from "./layout/adminlayout";

// ================================
// Route Protection
// ================================

import ProtectedRoute from "./router/protected";
import RoleRoute from "./router/roleroute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================
            PUBLIC ROUTES
        ================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/blogs/:slug"
          element={<BlogDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ==================================
            PROTECTED ROUTES
        ================================== */}

        <Route
          element={<ProtectedRoute />}
        >
          {/* ==================================
              ADMIN ROLE
          ================================== */}

          <Route
            element={
              <RoleRoute
                allowedRoles={["admin"]}
              />
            }
          >
            {/* ==================================
                ADMIN LAYOUT
            ================================== */}

            <Route
              element={<AdminLayout />}
            >

              {/* ==============================
                  DASHBOARD
              ============================== */}

              <Route
                path="/admin"
                element={<Dashboard />}
              />

              {/* ==============================
                  BLOG MANAGEMENT
              ============================== */}

              <Route
                path="/admin/blogs"
                element={<AdminBlogs />}
              />

              <Route
                path="/admin/blogs/create"
                element={<CreateBlog />}
              />

              <Route
                path="/admin/blogs/:id/edit"
                element={<EditBlog />}
              />

              {/* ==============================
                  ADMIN PROFILE
              ============================== */}

              <Route
                path="/admin/profile"
                element={<Profile />}
              />

            </Route>
          </Route>
        </Route>

        {/* ==================================
            404 FALLBACK
        ================================== */}

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-gray-900">
                  404
                </h1>

                <p className="mt-2 text-gray-500">
                  Page not found
                </p>

                <a
                  href="/"
                  className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;