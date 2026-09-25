import { Link } from "react-router-dom";

import type { Blog } from "../../types/blog";
import BlogMedia from "./blogmedia";
import ShareButton from "./sharebutton";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {blog.media?.url && (
        <div className="aspect-video overflow-hidden">
          <BlogMedia
            media={blog.media}
            className="h-full transition duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
          <span>{blog.author?.name}</span>

          <time dateTime={blog.createdAt}>
            {new Date(
              blog.createdAt
            ).toLocaleDateString()}
          </time>
        </div>

        <h2 className="mb-3 line-clamp-2 text-xl font-bold text-slate-900">
          {blog.title}
        </h2>

        <p className="mb-5 line-clamp-3 leading-6 text-slate-600">
          {blog.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-4 text-sm text-slate-500">
            <span>♥ {blog.likesCount}</span>

            <span>💬 {blog.commentsCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShareButton title={blog.title} />
            <Link
              to={`/blogs/${blog.slug}`}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Read more
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;