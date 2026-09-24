import {
  useEffect,
  useState,
} from "react";

// import {
//   Link,
// } from "react-router-dom";

import BlogCard from "../component/blog/blogcard";

import {
  getBlogs,
} from "../services/blog";

import type {
  Blog,
  Pagination,
} from "../types/blog";

const Home = () => {
  const [
    blogs,
    setBlogs,
  ] = useState<Blog[]>(
    []
  );

  const [
    pagination,
    setPagination,
  ] =
    useState<Pagination | null>(
      null
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const timer =
      window.setTimeout(
        async () => {
          try {
            setLoading(true);

            setError("");

            const response =
              await getBlogs(
                page,
                12,
                search
              );

            setBlogs(
              response.data
            );

            setPagination(
              response.pagination
            );
          } catch (error) {
            console.error(
              error
            );

            setError(
              "Unable to load blogs."
            );
          } finally {
            setLoading(
              false
            );
          }
        },
        300
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    page,
    search,
  ]);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              Latest stories
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Discover something
              worth reading.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Explore the latest
              articles, ideas and
              insights from our
              writers.
            </p>

            {/* SEARCH */}

            <div className="mt-8 flex max-w-2xl gap-3">

              <input
                type="search"
                value={search}
                onChange={(
                  event
                ) => {
                  setSearch(
                    event.target
                      .value
                  );

                  setPage(1);
                }}
                placeholder="Search articles..."
                className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          BLOGS
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="mb-8 flex items-end justify-between">

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Latest articles
            </h2>

            <p className="mt-1 text-slate-500">
              Freshly published
              stories.
            </p>
          </div>

          {pagination && (
            <span className="text-sm text-slate-500">
              {pagination.total}{" "}
              articles
            </span>
          )}

        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-2xl bg-slate-200"
                />
              )
            )}

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          blogs.length ===
            0 && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <h3 className="text-xl font-bold text-slate-900">
                No articles found
              </h3>

              <p className="mt-2 text-slate-500">
                Try a different
                search term.
              </p>

              {search && (
                <button
                  onClick={() => {
                    setSearch(
                      ""
                    );

                    setPage(
                      1
                    );
                  }}
                  className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Clear search
                </button>
              )}

            </div>
          )}

        {/* BLOG GRID */}

        {!loading &&
          !error &&
          blogs.length >
            0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {blogs.map(
                  (
                    blog
                  ) => (
                    <BlogCard
                      key={
                        blog._id
                      }
                      blog={
                        blog
                      }
                    />
                  )
                )}

              </div>

              {/* PAGINATION */}

              {pagination &&
                pagination.totalPages >
                  1 && (
                  <div className="mt-12 flex flex-wrap justify-center gap-2">

                    {Array.from(
                      {
                        length:
                          pagination.totalPages,
                      },
                      (
                        _,
                        index
                      ) =>
                        index +
                        1
                    ).map(
                      (
                        pageNumber
                      ) => (
                        <button
                          key={
                            pageNumber
                          }
                          onClick={() =>
                            setPage(
                              pageNumber
                            )
                          }
                          className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
                            page ===
                            pageNumber
                              ? "bg-slate-900 text-white"
                              : "bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {
                            pageNumber
                          }
                        </button>
                      )
                    )}

                  </div>
                )}

            </>
          )}

      </section>

    </main>
  );
};

export default Home;