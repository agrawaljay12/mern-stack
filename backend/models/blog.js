import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    media: {
      type: {
        type: String,
        enum: ["image", "gif", "video", "url", "none"],
        default: "none",
      },

      url: {
        type: String,
        trim: true,
      },

      thumbnail: {
        type: String,
        trim: true,
      },
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({
  title: "text",
  description: "text",
});

export default mongoose.model("Blog", blogSchema);