import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Company } from "../models/company.model.js";
import { Floor } from "../models/floor.model.js";
import { ParkingSlot } from "../models/parkingSlot.model.js";
import { ParkingLog } from "../models/parkingLog.model.js";



const addCompany = asyncHandler(async(req, res) => {
    const {name, email, assignedFloors, phone} = req.body;

    if (!name || !email || !phone) {
        throw new ApiError(400, "All Fields are required for adding the company!");
    }

    const existingCompany = await Company.findOne({email});

    if (existingCompany) {
        throw new ApiError(400, "The company already exists!");
    }

    const company = await Company.create({
        name,
        email,
        phone, 
        assignedFloors,
    })


    return res
    .status(200)
    .json(
        new ApiResponse(200, company, "Company Created Successfully")
    )
})