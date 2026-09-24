import type { BlogMedia as BlogMediaType } from "../../types/blog";

interface BlogMediaProps {
  media: BlogMediaType;
  className?: string;
}

const BlogMedia = ({
  media,
  className = "",
}: BlogMediaProps) => {
  if (!media || media.type === "none" || !media.url) {
    return null;
  }

  if (
    media.type === "image" ||
    media.type === "gif"
  ) {
    return (
      <img
        src={media.url}
        alt=""
        loading="lazy"
        className={`w-full object-cover ${className}`}
      />
    );
  }

  if (media.type === "video") {
    return (
      <video
        src={media.url}
        poster={media.thumbnail || undefined}
        controls
        preload="metadata"
        className={`w-full ${className}`}
      />
    );
  }

  if (media.type === "url") {
    return (
      <a
        href={media.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl border border-slate-200 p-4 text-blue-600 transition hover:bg-slate-50"
      >
        Open external resource →
      </a>
    );
  }

  return null;
};

export default BlogMedia;