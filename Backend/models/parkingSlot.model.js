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
