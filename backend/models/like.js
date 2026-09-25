import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    // Kept for backwards compatibility with existing records.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    guestToken: {
      type: String,
      default: null,
      index: true,
    },
    // One stable identity key avoids MongoDB null/unique-index conflicts
    // between authenticated and guest likes.
    identityKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ blog: 1, identityKey: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);
