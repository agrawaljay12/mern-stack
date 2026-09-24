import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  addComment,
  deleteComment,
  getBlogBySlug,
  toggleLike,
} from "../services/blog";

import type {
  Blog,
} from "../types/blog";

import BlogMedia from "../component/blog/blogmedia";

import CommentForm from "../component/blog/commentform";

import CommentList from "../component/blog/commentlist";

import ShareButton from "../component/blog/sharebutton";

const BlogDetails = () => {
  const {
    slug,
  } = useParams<{
    slug: string;
  }>();

  const [
    blog,
    setBlog,
  ] = useState<Blog | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    likeLoading,
    setLikeLoading,
  ] = useState(false);

  const [
    commentLoading,
    setCommentLoading,
  ] = useState(false);

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState<string | null>(
    null
  );

  const loadBlog =
    async () => {
      if (!slug) {
        return;
      }

      try {
        setLoading(true);

        setError("");

        const data =
          await getBlogBySlug(
            slug
          );

        setBlog(data);
      } catch (error) {
        console.error(
          error
        );

        setError(
          "Blog not found."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    loadBlog();
  }, [slug]);

  /* =======================================================
     LIKE
  ======================================================= */

  const handleLike =
    async () => {
      if (
        !blog ||
        likeLoading
      ) {
        return;
      }

      try {
        setLikeLoading(
          true
        );

        const result =
          await toggleLike(
            blog._id
          );

        setBlog(
          (previous) =>
            previous
              ? {
                  ...previous,

                  likedByUser:
                    result.liked,

                  likesCount:
                    result.likesCount,
                }
              : previous
        );
      } catch (error) {
        console.error(
          error
        );
      } finally {
        setLikeLoading(
          false
        );
      }
    };

  /* =======================================================
     COMMENT
  ======================================================= */

  const handleComment =
    async (
      name: string,
      text: string
    ) => {
      if (!blog) {
        return;
      }

      try {
        setCommentLoading(
          true
        );

        const comment =
          await addComment(
            blog._id,
            name,
            text
          );

        setBlog(
          (previous) =>
            previous
              ? {
                  ...previous,

                  comments: [
                    comment,
                    ...(previous.comments ||
                      []),
                  ],

                  commentsCount:
                    previous.commentsCount +
                    1,
                }
              : previous
        );
      } catch (error) {
        console.error(
          error
        );

        throw error;
      } finally {
        setCommentLoading(
          false
        );
      }
    };

  /* =======================================================
     DELETE COMMENT
  ======================================================= */

  const handleDeleteComment =
    async (
      commentId: string
    ) => {
      if (
        deleteLoading
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Delete this comment?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeleteLoading(
          commentId
        );

        await deleteComment(
          commentId
        );

        setBlog(
          (previous) =>
            previous
              ? {
                  ...previous,

                  comments:
                    previous.comments?.filter(
                      (
                        comment
                      ) =>
                        comment._id !==
                        commentId
                    ),

                  commentsCount:
                    Math.max(
                      previous.commentsCount -
                        1,
                      0
                    ),
                }
              : previous
        );
      } catch (error) {
        console.error(
          error
        );
      } finally {
        setDeleteLoading(
          null
        );
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500">
          Loading article...
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    error ||
    !blog
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

        <div className="text-center">

          <h1 className="text-4xl font-black text-slate-900">
            404
          </h1>

          <p className="mt-2 text-slate-500">
            Blog not found.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Back to home
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =================================================
          ARTICLE
      ================================================= */}

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

        {/* BACK */}

        <Link
          to="/"
          className="mb-8 inline-flex text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          ← Back to articles
        </Link>

        {/* HEADER */}

        <header>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">

            <span>
              {blog.author?.name ||
                "Admin"}
            </span>

            <span>•</span>

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

          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {blog.title}
          </h1>

        </header>

        {/* MEDIA */}

        {blog.media?.url && (
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

            <BlogMedia
              media={
                blog.media
              }
              className="max-h-[600px] w-full object-contain"
            />

          </div>
        )}

        {/* DESCRIPTION */}

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <p className="whitespace-pre-wrap text-lg leading-8 text-slate-700">
            {
              blog.description
            }
          </p>

        </div>

        {/* ACTIONS */}

        <div className="mt-6 flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={
              handleLike
            }
            disabled={
              likeLoading
            }
            className={`rounded-xl px-5 py-2.5 font-semibold transition ${
              blog.likedByUser
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            } disabled:opacity-50`}
          >
            {blog.likedByUser
              ? "♥ Liked"
              : "♡ Like"}

            {" "}

            {blog.likesCount}
          </button>

          <ShareButton
            title={
              blog.title
            }
          />

        </div>

        {/* =================================================
            COMMENTS
        ================================================= */}

        <section className="mt-12">

          <div className="mb-6">

            <h2 className="text-2xl font-black text-slate-900">
              Comments
            </h2>

            <p className="mt-1 text-slate-500">
              {blog.commentsCount}{" "}
              comments
            </p>

          </div>

          {/* ADD COMMENT */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <CommentForm
              onSubmit={
                handleComment
              }
              loading={
                commentLoading
              }
            />

          </div>

          {/* COMMENT LIST */}

          <div className="mt-8">

            <CommentList
              comments={
                blog.comments ||
                []
              }
              onDelete={
                handleDeleteComment
              }
              deleteLoading={
                deleteLoading
              }
            />

          </div>

        </section>

      </article>

    </main>
  );
};

export default BlogDetails;