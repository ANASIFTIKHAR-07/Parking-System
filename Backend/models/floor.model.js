import mongoose, {mongo, Schema} from "mongoose";

const floorSchema = new Schema({
    floorNumber: {
        type: Number,
    },
    assignedCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    totalSlots: {
        type: Number,
    },
    availableSlots: {
        type: Number,
    }
})



export const Floor = mongoose.model("Floor", floorSchema)