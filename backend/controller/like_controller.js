import Blog from "../models/blog.js";
import Like from "../models/like.js";

export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const existingLike = await Like.findOne({
      blog: blogId,
      user: req.user._id,
    });

    if (existingLike) {
      await Like.deleteOne({
        _id: existingLike._id,
      });

      await Blog.updateOne(
        { _id: blogId },
        {
          $inc: {
            likesCount: -1,
          },
        }
      );

      return res.json({
        success: true,
        liked: false,
        message: "Blog unliked",
      });
    }

    await Like.create({
      blog: blogId,
      user: req.user._id,
    });

    await Blog.updateOne(
      { _id: blogId },
      {
        $inc: {
          likesCount: 1,
        },
      }
    );

    res.json({
      success: true,
      liked: true,
      message: "Blog liked",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update like",
    });
  }
};