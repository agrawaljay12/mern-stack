import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import BlogForm from "../../component/admin/blogform";

import {
  getAdminBlogs,
  updateBlog,
} from "../../services/blog";

import type {
  Blog,
  BlogFormData,
} from "../../types/blog";

const EditBlog = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [blog, setBlog] =
    useState<Blog | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (!id) return;

    const loadBlog = async () => {
      try {
        const blogs = await getAdminBlogs();

        const selected = blogs.find(
          (item) => item._id === id
        );

        setBlog(selected ?? null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  const handleSubmit = async (
    data: BlogFormData
  ) => {
    if (!id) return;

    try {
      setSaving(true);

      await updateBlog(id, data);

      navigate("/admin/blogs");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p>Blog not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            Edit Blog
          </h1>

          <p className="mt-2 text-slate-500">
            Update your blog post.
          </p>
        </div>

        <BlogForm
          initialData={blog}
          onSubmit={handleSubmit}
          loading={saving}
        />
      </div>
    </main>
  );
};

export default EditBlog;