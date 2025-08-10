import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema({
  plateNumber: {
    type: Number,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  rfNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    trim: true,
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Floor",
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingSlot",
  },
  checkInTime: {
    type: Date,
    default: Date.now,
  },
  checkOutTime: {
    type: Date,
  },
});

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
