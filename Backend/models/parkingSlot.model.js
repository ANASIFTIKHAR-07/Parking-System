import mongoose, { Schema } from "mongoose";

const parkingSlotSchema = new Schema({
  slotNumber: {
    type: String,
    required: true,
    trim: true
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Floor",
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null
  },
  employee: {
    type: {
      name: { type: String, trim: true },
      vehicleNumber: { type: String, trim: true },
      rfid: { type: String, trim: true }
    },
    default: null
  }
}, { timestamps: true });

parkingSlotSchema.index(
  { floor: 1, slotNumber: 1 },
  { unique: true }
);

export const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);
