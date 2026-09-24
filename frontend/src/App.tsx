import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/blogdetail";
import BlogDetails from "./pages/blogdetail";

import AdminBlogs from "./pages/admin/adminblog";
import CreateBlog from "./pages/admin/createblog";
import EditBlog from "./pages/admin/editblog";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/blogs/:slug"
          element={<BlogDetails />}
        />

        {/* Admin */}
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;