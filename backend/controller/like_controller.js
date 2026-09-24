import Blog from "../models/blog.js";
import Like from "../models/like.js";

export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findOne({ _id: blogId, published: true });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const identity = req.user?.id
      ? { user: req.user.id }
      : { guestToken: req.guestToken };

    let existingLike = await Like.findOne({ blog: blogId, ...identity });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      await Blog.updateOne(
        { _id: blogId, likesCount: { $gt: 0 } },
        { $inc: { likesCount: -1 } }
      );
      return res.json({
        success: true,
        data: { liked: false, likesCount: Math.max((blog.likesCount || 0) - 1, 0) },
        message: "Blog unliked",
      });
    }

    try {
      await Like.create({ blog: blogId, ...identity });
    } catch (error) {
      // Handle a concurrent duplicate request as an already-liked state.
      if (error?.code === 11000) {
        existingLike = await Like.findOne({ blog: blogId, ...identity });
        if (existingLike) {
          return res.json({
            success: true,
            data: { liked: true, likesCount: blog.likesCount || 0 },
            message: "Blog already liked",
          });
        }
      }
      throw error;
    }

    await Blog.updateOne({ _id: blogId }, { $inc: { likesCount: 1 } });

    return res.json({
      success: true,
      data: { liked: true, likesCount: (blog.likesCount || 0) + 1 },
      message: "Blog liked",
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    return res.status(500).json({ success: false, message: "Failed to update like" });
  }
};
