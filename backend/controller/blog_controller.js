import mongoose from "mongoose";

import Blog from "../models/blog.js";
import Like from "../models/like.js";

/* =========================================================
   TOGGLE LIKE
========================================================= */

export const toggleLike =
  async (req, res) => {
    try {
      const {
        blogId,
      } = req.params;

      const guestToken =
        req.guestToken ||
        req.headers[
          "x-guest-token"
        ];

      /* Validate */

      if (
        !mongoose.Types.ObjectId.isValid(
          blogId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid blog ID",
        });
      }

      if (
        !guestToken ||
        typeof guestToken !== "string"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Guest token is required",
        });
      }

      /* Blog */

      const blog =
        await Blog.findById(
          blogId
        );

      if (!blog) {
        return res.status(404).json({
          success: false,
          message:
            "Blog not found",
        });
      }

      /* Existing like */

      const existingLike =
        await Like.findOne({
          blog: blogId,
          guestToken,
        });

      /* =====================================================
         UNLIKE
      ===================================================== */

      if (existingLike) {
        await Like.deleteOne({
          _id:
            existingLike._id,
        });

        const updatedBlog =
          await Blog.findByIdAndUpdate(
            blogId,
            {
              $inc: {
                likesCount: -1,
              },
            },
            {
              new: true,
            }
          );

        if (
          updatedBlog &&
          updatedBlog.likesCount < 0
        ) {
          updatedBlog.likesCount = 0;

          await updatedBlog.save();
        }

        return res.status(200).json({
          success: true,
          message:
            "Blog unliked successfully",

          data: {
            liked: false,

            likesCount:
              updatedBlog
                ?.likesCount || 0,
          },
        });
      }

      /* =====================================================
         LIKE
      ===================================================== */

      try {
        await Like.create({
          blog: blogId,
          guestToken,
        });
      } catch (error) {
        if (
          error?.code === 11000
        ) {
          const currentBlog =
            await Blog.findById(
              blogId
            );

          return res.status(200).json({
            success: true,
            message:
              "Blog already liked",

            data: {
              liked: true,

              likesCount:
                currentBlog
                  ?.likesCount || 0,
            },
          });
        }

        throw error;
      }

      const updatedBlog =
        await Blog.findByIdAndUpdate(
          blogId,
          {
            $inc: {
              likesCount: 1,
            },
          },
          {
            new: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Blog liked successfully",

        data: {
          liked: true,

          likesCount:
            updatedBlog
              ?.likesCount || 0,
        },
      });
    } catch (error) {
      console.error(
        "TOGGLE LIKE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update like",
      });
    }
  };