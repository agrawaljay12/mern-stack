import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import BlogDetails from "./pages/blogdetail";
import Login from "./pages/auth/login";
import Dashboard from "./pages/admin/dashboard";
import AdminBlogs from "./pages/admin/adminblog";
import CreateBlog from "./pages/admin/createblog";
import EditBlog from "./pages/admin/editblog";
import Profile from "./pages/admin/profile";
// import ChangePassword from "";
// import AdminComments from "./pages/admin/comments";
import AdminLayout from "./layout/adminlayout";
import ProtectedRoute from "./router/protected";
import RoleRoute from "./router/roleroute";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center"><h1 className="text-5xl font-bold text-gray-900">404</h1><p className="mt-2 text-gray-500">Page not found</p><a href="/" className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white">Go Home</a></div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
            <Route path="/admin/blogs/create" element={<CreateBlog />} />
            <Route path="/admin/blogs/:id/edit" element={<EditBlog />} />
            {/* <Route path="/admin/comments" element={<AdminComments />} /> */}
            <Route path="/admin/profile" element={<Profile />} />
            {/* <Route path="/admin/change-password" element={<ChangePassword />} /> */}
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
