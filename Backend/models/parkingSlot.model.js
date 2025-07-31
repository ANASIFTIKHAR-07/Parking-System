import mongoose, {Schema} from "mongoose";


const parkingSlotSchema = new Schema({
    slotNumber: {
        type: String,
        required: true,
    },
    isOccupied: {
        type: Boolean,
        required: true,
    },
    floor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    }
})


export const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);