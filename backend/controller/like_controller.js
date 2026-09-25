import mongoose from "mongoose";
import Blog from "../models/blog.js";
import Like from "../models/like.js";

const getIdentity = (req) => {
  const userId = req.user?.id;

  if (userId && mongoose.isValidObjectId(userId)) {
    return {
      user: userId,
      guestToken: null,
      identityKey: `user:${String(userId)}`,
    };
  }

  const guestToken =
    typeof req.guestToken === "string" && req.guestToken.trim()
      ? req.guestToken.trim()
      : null;

  if (!guestToken) return null;

  return {
    user: null,
    guestToken,
    identityKey: `guest:${guestToken}`,
  };
};

export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({ success: false, message: "Invalid blog id" });
    }

    const blog = await Blog.findOne({ _id: blogId, published: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const identity = getIdentity(req);
    if (!identity) {
      return res.status(400).json({ success: false, message: "Unable to identify visitor" });
    }

    const existingLike = await Like.findOne({
      blog: blogId,
      identityKey: identity.identityKey,
    });

    let liked;

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      liked = false;
    } else {
      await Like.create({
        blog: blogId,
        user: identity.user,
        guestToken: identity.guestToken,
        identityKey: identity.identityKey,
      });
      liked = true;
    }

    const likesCount = await Like.countDocuments({ blog: blogId });
    await Blog.updateOne({ _id: blogId }, { $set: { likesCount } });

    return res.json({
      success: true,
      data: { liked, likesCount },
      message: liked ? "Blog liked" : "Blog unliked",
    });
  } catch (error) {
    console.error("Toggle like error:", error);

    // A concurrent click can race with the unique identityKey index.
    // Re-read the state and return a valid response instead of a 500.
    if (error?.code === 11000) {
      try {
        const identity = getIdentity(req);
        const existingLike = identity
          ? await Like.findOne({ blog: req.params.blogId, identityKey: identity.identityKey })
          : null;
        const likesCount = await Like.countDocuments({ blog: req.params.blogId });

        return res.json({
          success: true,
          data: { liked: Boolean(existingLike), likesCount },
          message: existingLike ? "Blog liked" : "Blog unliked",
        });
      } catch (retryError) {
        console.error("Toggle like recovery error:", retryError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update like",
      error: process.env.NODE_ENV !== "production" ? error?.message : undefined,
    });
  }
};
