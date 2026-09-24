import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },

    guestToken: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

likeSchema.index(
  { blog: 1, guestToken: 1 },
  { unique: true }
);

export default mongoose.model("Like", likeSchema);