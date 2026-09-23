import { useEffect, useState } from "react";
import BlogCard from "../components/blog/BlogCard";
import { getBlogs } from "../services/blogApi";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const { data } = await getBlogs({
        search,
        page: 1,
        limit: 12,
      });

      setBlogs(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchBlogs, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Latest Stories
          </h1>

          <p className="mt-3 text-slate-600">
            Discover the latest articles and insights.
          </p>

          <div className="mt-6">
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search blogs..."
              className="w-full max-w-xl rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center">
            No blogs found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;