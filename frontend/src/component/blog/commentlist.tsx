import type { Comment } from "../../types/blog";

interface CommentListProps {
  comments: Comment[];
}

const CommentList = ({
  comments,
}: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        No comments yet. Be the first to
        comment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <article
          key={comment._id}
          className="rounded-xl bg-slate-50 p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">
              {comment.name}
            </h3>

            <time
              dateTime={comment.createdAt}
              className="text-xs text-slate-400"
            >
              {new Date(
                comment.createdAt
              ).toLocaleDateString()}
            </time>
          </div>

          <p className="mt-2 whitespace-pre-wrap text-slate-600">
            {comment.text}
          </p>
        </article>
      ))}
    </div>
  );
};

export default CommentList;