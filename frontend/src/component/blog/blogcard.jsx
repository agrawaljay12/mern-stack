import { Link } from "react-router-dom";
import BlogMedia from "./blogmedia";

const BlogCard = ({ blog }) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {blog.media?.url && (
        <BlogMedia media={blog.media} />
      )}

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
          <span>{blog.author?.name}</span>

          <span>
            {new Date(
              blog.createdAt
            ).toLocaleDateString()}
          </span>
        </div>

        <h2 className="mb-3 line-clamp-2 text-xl font-bold text-slate-900">
          {blog.title}
        </h2>

        <p className="mb-5 line-clamp-3 text-slate-600">
          {blog.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm text-slate-500">
            <span>❤️ {blog.likesCount}</span>
            <span>💬 {blog.commentsCount}</span>
          </div>

          <Link
            to={`/blogs/${blog.slug}`}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;