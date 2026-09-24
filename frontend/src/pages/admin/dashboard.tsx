import { useEffect, useMemo, useState } from "react";
import { FileText, MessageSquare, Heart, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getAdminBlogs } from "../../services/blog";
import type { Blog } from "../../types/blog";

const Dashboard = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminBlogs().then(setBlogs).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => ({
    blogs: blogs.length,
    likes: blogs.reduce((sum, blog) => sum + (blog.likesCount || 0), 0),
    comments: blogs.reduce((sum, blog) => sum + (blog.commentsCount || 0), 0),
  }), [blogs]);

  const stats = [
    { title: "Total Blogs", value: totals.blogs, description: "All blog posts", icon: FileText },
    { title: "Total Likes", value: totals.likes, description: "Likes across all blogs", icon: Heart },
    { title: "Comments", value: totals.comments, description: "Visitor comments", icon: MessageSquare },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="mt-1 text-sm text-gray-500">Live overview of your blog.</p></div>
        <Link to="/admin/blogs/create" className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"><Plus size={18} />Create Blog</Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ title, value, description, icon: Icon }) => (
          <div key={title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-gray-500">{title}</p><p className="mt-2 text-3xl font-bold text-gray-900">{loading ? "—" : value.toLocaleString()}</p></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100"><Icon size={22} /></div>
            </div>
            <p className="mt-4 text-sm text-gray-500">{description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["/admin/blogs/create", "Create Blog", "Publish a new blog post"],
            ["/admin/blogs", "Manage Blogs", "Edit or delete existing blogs"],
            ["/admin/comments", "Manage Comments", "Review visitor comments"],
          ].map(([to, title, description]) => (
            <Link key={to} to={to} className="group rounded-lg border border-gray-200 p-4 hover:border-gray-400 hover:bg-gray-50">
              <div className="flex items-center justify-between"><div><h3 className="font-medium text-gray-900">{title}</h3><p className="mt-1 text-sm text-gray-500">{description}</p></div><ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1" /></div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5"><div><h2 className="text-lg font-semibold text-gray-900">Recent Blogs</h2><p className="mt-1 text-sm text-gray-500">Latest posts from the API</p></div><Link to="/admin/blogs" className="text-sm font-medium text-gray-700">View all</Link></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]"><thead><tr className="border-b border-gray-200 bg-gray-50">
            {["Blog", "Status", "Likes", "Comments", "Date"].map((h) => <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>)}
          </tr></thead><tbody>
            {loading ? <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr> :
             blogs.slice(0, 5).map((blog) => <tr key={blog._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-6 py-4"><Link to={`/admin/blogs/${blog._id}/edit`} className="font-medium text-gray-900 hover:underline">{blog.title}</Link></td>
              <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${blog.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{blog.published ? "Published" : "Draft"}</span></td>
              <td className="px-6 py-4 text-sm text-gray-600">{blog.likesCount}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{blog.commentsCount}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
            </tr>)}
            {!loading && blogs.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No blogs found.</td></tr>}
          </tbody></table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
