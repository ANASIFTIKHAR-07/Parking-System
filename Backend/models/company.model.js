import mongoose, {Schema} from "mongoose";


const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    assignedFloors: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Floor"
        }
    ],
},
{timestamps: true}
);


export const Company = mongoose.model("Company", companySchema); 