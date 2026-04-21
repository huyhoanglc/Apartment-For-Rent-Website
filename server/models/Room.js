import mongoose from "mongoose";
import apartmentImageSchema from "./ApartmentImage.js";

const roomSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, trim: true },
    roomType: {
      type: String,
      enum: ["studio", "1br", "2br"],
      default: "studio",
    },
    pricePerMonth: { type: Number, required: true },
    area: Number,
    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
    },
    images: [apartmentImageSchema],
  },
  { timestamps: true },
);

export default roomSchema;
