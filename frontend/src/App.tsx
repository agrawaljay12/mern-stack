import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

/* Public */

import Home from "./pages/home";

import BlogDetails from "./pages/blogdetail";

import Login from "./pages/auth/login";

/* Admin */

import Dashboard from "./pages/admin/dashboard";

import AdminBlogs from "./pages/admin/adminblog";

import CreateBlog from "./pages/admin/createblog";

import EditBlog from "./pages/admin/editblog";

import Profile from "./pages/admin/profile";

/* Layout */

import AdminLayout from "./layout/adminlayout";

/* Protection */

import ProtectedRoute from "./router/protected";

import RoleRoute from "./router/roleroute";

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC
        ================================================= */}

        <Route
          path="/"
          element={
            <Home />
          }
        />

        <Route
          path="/blogs/:slug"
          element={
            <BlogDetails />
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          element={
            <ProtectedRoute />
          }
        >

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "admin",
                ]}
              />
            }
          >

            <Route
              element={
                <AdminLayout />
              }
            >

              <Route
                path="/admin"
                element={
                  <Dashboard />
                }
              />

              <Route
                path="/admin/blogs"
                element={
                  <AdminBlogs />
                }
              />

              <Route
                path="/admin/blogs/create"
                element={
                  <CreateBlog />
                }
              />

              <Route
                path="/admin/blogs/:id/edit"
                element={
                  <EditBlog />
                }
              />

              <Route
                path="/admin/profile"
                element={
                  <Profile />
                }
              />

            </Route>

          </Route>

        </Route>

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

              <div className="text-center">

                <h1 className="text-6xl font-black text-slate-900">
                  404
                </h1>

                <p className="mt-3 text-slate-500">
                  Page not found.
                </p>

                <a
                  href="/"
                  className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
                >
                  Back home
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