import mongoose, {Schema} from "mongoose";


const parkingLogSchema = new Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ParkingSlot",
    },
    floor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
    },
    checkInTime: {
        type: Date,
        required: true,
    },
    checkOutTime: {
        type: Date,
    },
},
{timestamps: true});

export const ParkingLog = mongoose.model("ParkingLog", parkingLogSchema);