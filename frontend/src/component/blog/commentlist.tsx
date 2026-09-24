import type {
  Comment,
} from "../../types/blog";

interface CommentListProps {
  comments: Comment[];

  onDelete?: (
    commentId: string
  ) => Promise<void>;

  deleteLoading?: string | null;
}

const CommentList = ({
  comments,
  onDelete,
  deleteLoading,
}: CommentListProps) => {
  if (
    comments.length ===
    0
  ) {
    return (
      <div className="rounded-2xl bg-white py-10 text-center shadow-sm">

        <p className="text-slate-500">
          No comments yet.
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Be the first to
          comment.
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-4">

      {comments.map(
        (
          comment
        ) => (
          <article
            key={
              comment._id
            }
            className="rounded-2xl bg-white p-5 shadow-sm"
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <h3 className="font-bold text-slate-900">
                  {
                    comment.name
                  }
                </h3>

                <time
                  dateTime={
                    comment.createdAt
                  }
                  className="mt-1 block text-xs text-slate-400"
                >
                  {new Date(
                    comment.createdAt
                  ).toLocaleString()}
                </time>

              </div>

              {comment.canDelete &&
                onDelete && (
                  <button
                    type="button"
                    onClick={() =>
                      onDelete(
                        comment._id
                      )
                    }
                    disabled={
                      deleteLoading ===
                      comment._id
                    }
                    className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {deleteLoading ===
                    comment._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}

            </div>

            <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
              {
                comment.text
              }
            </p>

          </article>
        )
      )}

    </div>
  );
};

export default CommentList;