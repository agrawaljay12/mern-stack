import {
  Link,
} from "react-router-dom";

import type {
  Blog,
} from "../../types/blog";

import BlogMedia from "./blogmedia";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({
  blog,
}: BlogCardProps) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* MEDIA */}

      {blog.media?.url && (
        <Link
          to={`/blogs/${blog.slug}`}
          className="block aspect-video overflow-hidden bg-slate-100"
        >
          <BlogMedia
            media={blog.media}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
      )}

      {/* CONTENT */}

      <div className="p-5">

        {/* META */}

        <div className="mb-3 flex items-center justify-between gap-3 text-sm text-slate-500">

          <span className="truncate">
            {blog.author?.name ||
              "Admin"}
          </span>

          <time
            dateTime={
              blog.createdAt
            }
          >
            {new Date(
              blog.createdAt
            ).toLocaleDateString()}
          </time>

        </div>

        {/* TITLE */}

        <Link
          to={`/blogs/${blog.slug}`}
        >
          <h2 className="mb-3 line-clamp-2 text-xl font-bold text-slate-900 transition group-hover:text-slate-600">
            {blog.title}
          </h2>
        </Link>

        {/* DESCRIPTION */}

        <p className="mb-5 line-clamp-3 leading-6 text-slate-600">
          {blog.description}
        </p>

        {/* FOOTER */}

        <div className="flex items-center justify-between">

          <div className="flex gap-4 text-sm text-slate-500">

            <span>
              ♥{" "}
              {blog.likesCount}
            </span>

            <span>
              💬{" "}
              {blog.commentsCount}
            </span>

          </div>

          <Link
            to={`/blogs/${blog.slug}`}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Read more
          </Link>

        </div>

      </div>

    </article>
  );
};

export default BlogCard;