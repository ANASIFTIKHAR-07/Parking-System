import mongoose, { Schema } from "mongoose";

const parkingSlotSchema = new Schema({
    slotNumber: {
        type: String,
        required: true,
    },
    floor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // assuming you'll have an Employee model
        default: null,
    }
}, { timestamps: true });

export const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);
