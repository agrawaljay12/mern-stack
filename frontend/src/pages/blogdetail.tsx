import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addComment, getBlogBySlug, toggleLike } from "../services/blog";
import type { Blog } from "../types/blog";
import BlogMedia from "../component/blog/blogmedia";
import CommentForm from "../component/blog/commentform";
import CommentList from "../component/blog/commentlist";
import PublicHeader from "../navigation/publicheader";
import authHelper from "../utils/auth";

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBlog = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError("");
      setBlog(await getBlogBySlug(slug));
    } catch (e) {
      console.error(e);
      setError("Unable to load this blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBlog(); }, [slug]);

  const handleLike = async () => {
    if (!blog || likeLoading) return;
    try {
      setLikeLoading(true);
      const result = await toggleLike(blog._id);
      setBlog((current) => current ? {
        ...current,
        likedByUser: result.liked,
        likesCount: result.likesCount ?? current.likesCount + (result.liked ? 1 : -1),
      } : current);
    } catch (e) {
      console.error(e);
      setError("Unable to update like.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (name: string, text: string) => {
    if (!blog) return;
    try {
      setCommentLoading(true);
      const comment = await addComment(blog._id, name, text);
      setBlog((current) => current ? {
        ...current,
        comments: [comment, ...(current.comments || [])],
        commentsCount: current.commentsCount + 1,
      } : current);
    } catch (e) {
      console.error(e);
      setError("Unable to post comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <><PublicHeader /><div className="p-12 text-center text-slate-500">Loading...</div></>;
  if (!blog) return <><PublicHeader /><div className="mx-auto max-w-3xl p-12 text-center"><h1 className="text-3xl font-bold">Blog not found</h1><Link to="/" className="mt-4 inline-block text-blue-600">Back home</Link></div></>;

  const user = authHelper.getUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {blog.media?.url && <BlogMedia media={blog.media} className="max-h-[480px] w-full" />}
          <div className="p-6 sm:p-10">
            <div className="text-sm text-slate-500">{blog.author?.name} · {new Date(blog.createdAt).toLocaleDateString()}</div>
            <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-5xl">{blog.title}</h1>
            <p className="mt-6 whitespace-pre-wrap text-lg leading-8 text-slate-700">{blog.description}</p>

            <div className="mt-8 flex items-center gap-4 border-y border-slate-100 py-5">
              <button onClick={handleLike} disabled={likeLoading}
                className={`rounded-xl px-5 py-3 font-semibold ${blog.likedByUser ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                {blog.likedByUser ? "♥ Liked" : "♡ Like"} · {blog.likesCount}
              </button>
              <span className="text-sm text-slate-500">💬 {blog.commentsCount} comments</span>
            </div>
          </div>
        </article>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Comments</h2>
          <div className="mt-6"><CommentForm onSubmit={handleComment} loading={commentLoading} /></div>
          <div className="mt-8"><CommentList comments={blog.comments || []} /></div>
        </section>

        {user?.role === "admin" && (
          <div className="mt-6 text-center"><Link to="/admin" className="text-sm text-blue-600">Open admin dashboard</Link></div>
        )}
      </main>
    </div>
  );
};

export default BlogDetails;
