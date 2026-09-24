import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
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
  },
  { timestamps: true }
);

likeSchema.index(
  { blog: 1, user: 1 },
  { unique: true, partialFilterExpression: { user: { $type: "objectId" } } }
);
likeSchema.index(
  { blog: 1, guestToken: 1 },
  { unique: true, partialFilterExpression: { guestToken: { $type: "string" } } }
);

export default mongoose.model("Like", likeSchema);
