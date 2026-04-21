import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    cloudinaryPublicId: String,
    url: String,
    sortOrder: { type: Number, default: 0 },
    isMain: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export default schema;
