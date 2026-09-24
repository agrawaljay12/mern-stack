import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteBlog,
  getAdminBlogs,
} from "../services/blog";

import type { Blog } from "../types/blog";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const loadBlogs = async () => {
    try {
      setLoading(true);

      const data = await getAdminBlogs();

      setBlogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    try {
      await deleteBlog(id);

      setBlogs((previous) =>
        previous.filter(
          (blog) => blog._id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Manage Blogs
            </h1>

            <p className="mt-1 text-slate-500">
              Create, edit and manage your
              blog posts.
            </p>
          </div>

          <Link
            to="/admin/blogs/create"
            className="rounded-xl bg-slate-900 px-5 py-3 text-center font-semibold text-white hover:bg-slate-700"
          >
            + Create Blog
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-sm text-slate-600">
                  <th className="px-6 py-4">
                    Title
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Likes
                  </th>

                  <th className="px-6 py-4">
                    Comments
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b last:border-0"
                  >
                    <td className="max-w-xs px-6 py-4 font-semibold">
                      <span className="line-clamp-2">
                        {blog.title}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          blog.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {blog.published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {blog.likesCount}
                    </td>

                    <td className="px-6 py-4">
                      {blog.commentsCount}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(
                        blog.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/blogs/${blog._id}/edit`}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium hover:bg-slate-200"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              blog._id
                            )
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {blogs.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                No blogs found.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminBlogs;