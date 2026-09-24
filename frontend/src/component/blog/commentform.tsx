import {
  type FormEvent,
  useState,
} from "react";

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
  const [
    name,
    setName,
  ] = useState("");

  const [
    text,
    setText,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      setError("");

      if (
        !name.trim() ||
        !text.trim()
      ) {
        setError(
          "Name and comment are required."
        );

        return;
      }

      try {
        await onSubmit(
          name.trim(),
          text.trim()
        );

        setText("");
      } catch {
        setError(
          "Unable to post comment. Please try again."
        );
      }
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-4"
    >

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <input
        value={name}
        onChange={(
          event
        ) =>
          setName(
            event.target
              .value
          )
        }
        placeholder="Your name"
        maxLength={100}
        required
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
      />

      <textarea
        value={text}
        onChange={(
          event
        ) =>
          setText(
            event.target
              .value
          )
        }
        placeholder="Write a comment..."
        rows={4}
        maxLength={2000}
        required
        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
      />

      <div className="flex items-center justify-between">

        <span className="text-xs text-slate-400">
          Comments are posted
          anonymously.
        </span>

        <button
          type="submit"
          disabled={
            loading
          }
          className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {loading
            ? "Posting..."
            : "Post comment"}
        </button>

      </div>

    </form>
  );
};

export default CommentForm;