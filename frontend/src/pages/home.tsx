import { useEffect, useState } from "react";
import { getBlogs } from "../services/blog";
import BlogCard from "../component/blog/blogcard";
import PublicHeader from "../navigation/publicheader";
import type { Blog, Pagination } from "../types/blog";

const Home = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        const response = await getBlogs(page, 12, search);
        setBlogs(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [page, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Latest Stories</h1>
            <p className="mt-3 text-lg text-slate-600">Discover the latest articles and insights.</p>
            <div className="mt-6 max-w-xl">
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search blogs..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <h2 className="text-xl font-bold">No blogs found</h2>
              <p className="mt-2 text-slate-500">Try another search.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => setPage(n)}
                      className={`h-10 w-10 rounded-lg font-medium ${page === n ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
