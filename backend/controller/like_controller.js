import mongoose from "mongoose";

import Blog from "../models/blog.js";
import Like from "../models/like.js";

export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;

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

    const existingLike = await Like.findOne({
      blog: blog._id,
      guestToken: req.guestToken,
    });

    /*
     * UNLIKE
     */
    if (existingLike) {
      await Like.deleteOne({
        _id: existingLike._id,
      });

      await Blog.updateOne(
        { _id: blog._id },
        {
          $inc: {
            likesCount: -1,
          },
        }
      );

      const updatedBlog = await Blog.findById(blog._id)
        .select("likesCount")
        .lean();

      return res.json({
        success: true,
        message: "Like removed successfully",
        data: {
          liked: false,
          likesCount: Math.max(
            updatedBlog?.likesCount ?? 0,
            0
          ),
        },
      });
    }

    /*
     * LIKE
     */
    await Like.create({
      blog: blog._id,
      guestToken: req.guestToken,
    });

    await Blog.updateOne(
      { _id: blog._id },
      {
        $inc: {
          likesCount: 1,
        },
      }
    );

    const updatedBlog = await Blog.findById(blog._id)
      .select("likesCount")
      .lean();

    return res.json({
      success: true,
      message: "Blog liked successfully",
      data: {
        liked: true,
        likesCount: updatedBlog?.likesCount ?? 1,
      },
    });
  } catch (error) {
    console.error("TOGGLE LIKE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update like",
    });
  }
};