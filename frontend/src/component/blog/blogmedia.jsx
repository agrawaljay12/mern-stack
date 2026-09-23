const BlogMedia = ({ media }) => {
  if (!media?.url || media.type === "none") {
    return null;
  }

  if (media.type === "image" || media.type === "gif") {
    return (
      <img
        src={media.url}
        alt=""
        className="w-full rounded-2xl object-cover"
        loading="lazy"
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
        className="w-full rounded-2xl"
      />
    );
  }

  if (media.type === "url") {
    return (
      <a
        href={media.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl border border-slate-200 p-4 text-blue-600 hover:bg-slate-50"
      >
        Open external resource →
      </a>
    );
  }

  return null;
};

export default BlogMedia;