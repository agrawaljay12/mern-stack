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

        <Route element={<ProtectedRoute />}>

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

            <Route element={<AdminLayout />}>

              {/* Dashboard */}

              <Route
                path="/admin"
                element={<Dashboard />}
              />

              {/* Blog Management */}

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

              {/* Admin Profile */}

              <Route
                path="/admin/profile"
                element={<Profile />}
              />

            </Route>

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;