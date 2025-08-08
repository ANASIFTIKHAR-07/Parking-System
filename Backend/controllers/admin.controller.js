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

const getAllCompanies = asyncHandler(async(req, res)=> {
    const companies = await Company.find()
    .sort({createdAt: -1})

    return res
    .status(200)
    .json(
        new ApiResponse(200, companies, "All Companies Fetched.")
    )
})


const updateCompany = asyncHandler(async(req, res)=> {

    const updates = req.body;

    const company = await Company.findByIdAndUpdate(
        {_id: req.params.id},
        updates,
        {new: true}
    ).select("-email -refreshtoken")   


    if (!company) {
        throw new ApiError(404, "Company Not Found.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, company, "Company Details Updated Successfully.")
    )
})

const deleteCompany = asyncHandler(async(req, res)=> {
    const company = await Company.findByIdAndDelete({
        _id: req.params.id,
    })

    if (!company) {
        throw new ApiError(404, "Company Not Found.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Company Deleted Successfully.")
    )
})


const createFloor = asyncHandler(async(req, res)=> {
    const {floorNumber, assignedCompany, totalSlots} = req.body;

    if (!floorNumber || !assignedCompany || !totalSlots) {
        throw new ApiError(400, "All fields are required!")
    }

    const existingFloor = await Floor.findOne({
        floorNumber
    });

    if (existingFloor) {
        throw new ApiError(409, "Floor already exist with this number.")
    }

    const floor = await Floor.create({
        floorNumber,
        assignedCompany,
        totalSlots,
        availableSlots: totalSlots,
    });

    return res.status(201).json(
        new ApiResponse(201, floor, "Floor created successfully.")
    );
})


export {
    addCompany,
    deleteCompany,
    updateCompany,
    getAllCompanies,
    createFloor,
}