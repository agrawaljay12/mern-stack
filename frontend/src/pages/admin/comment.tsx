import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteComment, getAdminComments } from "../../services/blog";
import type { Comment } from "../../types/blog";

type AdminComment = Comment & { blog?: { title?: string; slug?: string } };

const AdminComments = () => {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { setLoading(true); setComments(await getAdminComments() as AdminComment[]); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(id);
      setComments((items) => items.filter((item) => item._id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
        <p className="mt-1 text-sm text-gray-500">Review and remove visitor comments.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? <div className="p-8 text-center text-gray-500">Loading comments...</div> :
        comments.length === 0 ? <div className="p-8 text-center text-gray-500">No comments found.</div> :
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <div key={comment._id} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900">{comment.name}</span>
                    {comment.blog?.slug && <Link to={`/blogs/${comment.blog.slug}`} className="text-xs text-blue-600 hover:underline">{comment.blog.title || "View blog"}</Link>}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">{comment.text}</p>
                  <p className="mt-2 text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDelete(comment._id)} className="shrink-0 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
};

export default AdminComments;
