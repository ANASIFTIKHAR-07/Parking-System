import mongoose, {Schema} from "mongoose";

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
        name: String,
        vehicleNumber: String,
        rfid: String
    }
}, { timestamps: true });

parkingSlotSchema.index(
    { floor: 1, slotNumber: 1 },
    { unique: true }
  );

export const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);
