import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BlogForm from "./blogform";

import { createBlog } from "../../services/blog";

import type { BlogFormData } from "../../types/blog";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    formData: BlogFormData
  ) => {
    try {
      setLoading(true);

      await createBlog(formData);

      navigate("/admin/blogs");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">
            Create Blog
          </h1>

          <p className="mt-2 text-slate-500">
            Create and publish a new article.
          </p>
        </div>

        <BlogForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </main>
  );
};

export default CreateBlog;