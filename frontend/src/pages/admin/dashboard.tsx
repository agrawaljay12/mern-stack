import {
  FileText,
  MessageSquare,
  Heart,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Blogs",
      value: "24",
      description: "Published blog posts",
      icon: FileText,
    },
    {
      title: "Total Likes",
      value: "1,284",
      description: "Likes across all blogs",
      icon: Heart,
    },
    {
      title: "Comments",
      value: "356",
      description: "Visitor comments",
      icon: MessageSquare,
    },
  ];

  const recentBlogs = [
    {
      id: 1,
      title: "Getting Started with React",
      status: "Published",
      likes: 124,
      comments: 32,
      date: "Sep 24, 2026",
    },
    {
      id: 2,
      title: "Understanding Node.js",
      status: "Published",
      likes: 98,
      comments: 21,
      date: "Sep 22, 2026",
    },
    {
      id: 3,
      title: "MongoDB for Beginners",
      status: "Published",
      likes: 76,
      comments: 15,
      date: "Sep 20, 2026",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back. Here is what is happening with your blog.
          </p>
        </div>

        <Link
          to="/admin/blogs/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Create Blog
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <Icon size={22} className="text-gray-700" />
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/blogs/create"
            className="group rounded-lg border border-gray-200 p-4 transition hover:border-gray-400 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  Create Blog
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Publish a new blog post
                </p>
              </div>

              <ArrowRight
                size={18}
                className="text-gray-400 transition group-hover:translate-x-1"
              />
            </div>
          </Link>

          <Link
            to="/admin/blogs"
            className="group rounded-lg border border-gray-200 p-4 transition hover:border-gray-400 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  Manage Blogs
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Edit or delete existing blogs
                </p>
              </div>

              <ArrowRight
                size={18}
                className="text-gray-400 transition group-hover:translate-x-1"
              />
            </div>
          </Link>

          <Link
            to="/admin/comments"
            className="group rounded-lg border border-gray-200 p-4 transition hover:border-gray-400 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  Manage Comments
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Review visitor comments
                </p>
              </div>

              <ArrowRight
                size={18}
                className="text-gray-400 transition group-hover:translate-x-1"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Blogs */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Blogs
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your latest published blog posts
            </p>
          </div>

          <Link
            to="/admin/blogs"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Blog
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Likes
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Comments
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {recentBlogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/blogs/${blog.id}/edit`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {blog.title}
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      {blog.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {blog.likes}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {blog.comments}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {blog.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;