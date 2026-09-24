import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import type {
  Blog,
  BlogFormData,
  MediaType,
} from "../../types/blog";

interface BlogFormProps {
  initialData?: Blog;
  loading?: boolean;

  onSubmit: (
    data: BlogFormData
  ) => Promise<void>;
}

const defaultForm: BlogFormData = {
  title: "",
  description: "",
  mediaType: "none",
  mediaUrl: "",
  thumbnail: "",
  published: true,
};

const BlogForm = ({
  initialData,
  loading = false,
  onSubmit,
}: BlogFormProps) => {
  const [form, setForm] =
    useState<BlogFormData>(defaultForm);

  useEffect(() => {
    if (!initialData) return;

    setForm({
      title: initialData.title,
      description:
        initialData.description,
      mediaType:
        initialData.media?.type ?? "none",
      mediaUrl:
        initialData.media?.url ?? "",
      thumbnail:
        initialData.media?.thumbnail ?? "",
      published: initialData.published,
    });
  }, [initialData]);

  const updateField = <
    K extends keyof BlogFormData
  >(
    field: K,
    value: BlogFormData[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    await onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Blog title
        </label>

        <input
          required
          maxLength={200}
          value={form.title}
          onChange={(event) =>
            updateField(
              "title",
              event.target.value
            )
          }
          placeholder="Enter blog title"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Description
        </label>

        <textarea
          required
          rows={12}
          value={form.description}
          onChange={(event) =>
            updateField(
              "description",
              event.target.value
            )
          }
          placeholder="Write your blog content..."
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Media type
        </label>

        <select
          value={form.mediaType}
          onChange={(event) =>
            updateField(
              "mediaType",
              event.target.value as MediaType
            )
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
        >
          <option value="none">
            No media
          </option>

          <option value="image">
            Image
          </option>

          <option value="gif">
            GIF
          </option>

          <option value="video">
            Video
          </option>

          <option value="url">
            External URL
          </option>
        </select>
      </div>

      {form.mediaType !== "none" && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Media URL
            </label>

            <input
              type="url"
              value={form.mediaUrl}
              onChange={(event) =>
                updateField(
                  "mediaUrl",
                  event.target.value
                )
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {form.mediaType ===
            "video" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Video thumbnail URL
              </label>

              <input
                type="url"
                value={form.thumbnail}
                onChange={(event) =>
                  updateField(
                    "thumbnail",
                    event.target.value
                  )
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>
          )}
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(event) =>
            updateField(
              "published",
              event.target.checked
            )
          }
          className="h-4 w-4 rounded"
        />

        <span className="text-sm font-medium text-slate-700">
          Publish blog
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : initialData
          ? "Update Blog"
          : "Create Blog"}
      </button>
    </form>
  );
};

export default BlogForm;