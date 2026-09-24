import { type FormEvent, useState } from "react";

interface CommentFormProps {
  onSubmit: (
    name: string,
    text: string
  ) => Promise<void>;

  loading?: boolean;
}

const CommentForm = ({
  onSubmit,
  loading = false,
}: CommentFormProps) => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim() || !text.trim()) {
      return;
    }

    await onSubmit(
      name.trim(),
      text.trim()
    );

    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        placeholder="Your name"
        maxLength={50}
        required
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
      />

      <textarea
        value={text}
        onChange={(event) =>
          setText(event.target.value)
        }
        placeholder="Write a comment..."
        rows={4}
        maxLength={1000}
        required
        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50"
      >
        {loading
          ? "Posting..."
          : "Post comment"}
      </button>
    </form>
  );
};

export default CommentForm;