import mongoose from "mongoose";

import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { name, text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog id",
      });
    }

    if (!req.guestToken) {
      return res.status(400).json({
        success: false,
        message: "Guest identity is required",
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const blog = await Blog.findOne({
      _id: blogId,
      published: true,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comment = await Comment.create({
      blog: blog._id,
      name: name.trim(),
      text: text.trim(),
      guestToken: req.guestToken,
    });

    await Blog.updateOne(
      { _id: blog._id },
      { $inc: { commentsCount: 1 } }
    );

    const responseComment = {
      id: comment._id.toString(),
      blog: comment.blog.toString(),
      name: comment.name,
      text: comment.text,
      createdAt: comment.createdAt,
      canDelete: true,
    };

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: responseComment,
    });
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment id",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    /*
     * ADMIN CAN DELETE ANY COMMENT
     */
    if (req.user?.role === "admin") {
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

      return res.json({
        success: true,
        message: "Comment deleted successfully",
      });
    }

    /*
     * GUEST CAN DELETE ONLY THEIR OWN COMMENT
     */
    if (!req.guestToken) {
      return res.status(401).json({
        success: false,
        message: "Guest identity is required",
      });
    }

    if (comment.guestToken !== req.guestToken) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comment",
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

    return res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};