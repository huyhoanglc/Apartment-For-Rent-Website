import mongoose from "mongoose";
import roomSchema from "./Room.js";

const apartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    houseNumber: { type: String, trim: true },
    street: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true, index: true },
    ownerPhone: { type: String, trim: true },
    managerPhone: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{9,11}$/,
    },
    transportType: {
      type: String,
      enum: ["elevator", "stairs"],
      default: "stairs",
    },
    petPolicy: {
      type: String,
      enum: ["allowed", "none", "cats_only"],
      default: "none",
    },
    allowForeigners: { type: Boolean, default: false },
    allowShortTerm: { type: Boolean, default: false },
    rooms: [roomSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Apartment", apartmentSchema);
