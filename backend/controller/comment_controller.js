import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const serializeComment = (comment) => ({
  ...comment,
  name: comment.name || comment.user?.name || "Anonymous",
});

export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { name, text } = req.body;

    const blog = await Blog.findOne({ _id: blogId, published: true });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Comment is required" });
    }

    const comment = await Comment.create({
      blog: blogId,
      user: req.user?.id || null,
      guestToken: req.user ? null : req.guestToken,
      name: req.user?.name || name?.trim() || "Anonymous",
      text: text.trim(),
    });

    await Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } });

    const populated = await Comment.findById(comment._id)
      .populate("user", "name")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: serializeComment(populated),
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};

export const getAllComments = async (_req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name email")
      .populate("blog", "title slug")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: comments.map(serializeComment),
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch comments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (req.user?.role !== "admin") {
      if (!req.guestToken || comment.guestToken !== req.guestToken) {
        return res.status(403).json({ success: false, message: "You can only delete your own comment" });
      }
    }

    await Comment.findByIdAndDelete(commentId);
    await Blog.updateOne(
      { _id: comment.blog, commentsCount: { $gt: 0 } },
      { $inc: { commentsCount: -1 } }
    );

    return res.json({
      success: true,
      message: "Comment deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete comment" });
  }
};
