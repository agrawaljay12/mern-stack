import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { name, text } = req.body;

    const guestToken = req.headers["x-guest-token"];

    if (!guestToken) {
      return res.status(401).json({
        success: false,
        message: "Guest token is required",
      });
    }

    if (!name || !text) {
      return res.status(400).json({
        success: false,
        message: "Name and comment are required",
      });
    }

    const comment = await Comment.create({
      blog: blogId,
      guestToken,
      name,
      text,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // --------------------------------
    // ADMIN
    // --------------------------------

    if (req.user && req.user.role === "admin") {
      await Comment.findByIdAndDelete(commentId);

      return res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
        data: null,
      });
    }

    // --------------------------------
    // GUEST
    // --------------------------------

    const guestToken = req.headers["x-guest-token"];

    if (!guestToken) {
      return res.status(401).json({
        success: false,
        message: "Guest token is required",
      });
    }

    if (comment.guestToken !== guestToken) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comment",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};