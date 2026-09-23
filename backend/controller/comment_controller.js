import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comment = await Comment.create({
      blog: blogId,
      user: req.user._id,
      text: text.trim(),
    });

    await Blog.updateOne(
      { _id: blogId },
      {
        $inc: {
          commentsCount: 1,
        },
      }
    );

    const populatedComment = await Comment.findById(
      comment._id
    )
      .populate("user", "name")
      .lean();

    res.status(201).json({
      success: true,
      message: "Comment added",
      data: populatedComment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(
      req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const isOwner =
      comment.user.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this comment",
      });
    }

    await Comment.deleteOne({
      _id: comment._id,
    });

    await Blog.updateOne(
      { _id: comment.blog },
      {
        $inc: {
          commentsCount: -1,
        },
      }
    );

    res.json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};