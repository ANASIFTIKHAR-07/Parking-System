import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Company } from "../models/company.model.js";
import { Floor } from "../models/floor.model.js";
import { ParkingSlot } from "../models/parkingSlot.model.js";
import { ParkingLog } from "../models/parkingLog.model.js";

const addCompany = asyncHandler(async (req, res) => {
  const { name, email, assignedFloors, phone } = req.body;

  if (!name || !email || !phone) {
    throw new ApiError(400, "All Fields are required for adding the company!");
  }

  const existingCompany = await Company.findOne({ email });

  if (existingCompany) {
    throw new ApiError(400, "The company already exists!");
  }

  const company = await Company.create({
    name,
    email,
    phone,
    assignedFloors,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, company, "Company Created Successfully"));
});

const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, companies, "All Companies Fetched."));
});

const updateCompany = asyncHandler(async (req, res) => {
  const updates = req.body;

  const company = await Company.findByIdAndUpdate(
    { _id: req.params.id },
    updates,
    { new: true }
  ).select("-email -refreshtoken");

  if (!company) {
    throw new ApiError(404, "Company Not Found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, company, "Company Details Updated Successfully.")
    );
});

const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndDelete({
    _id: req.params.id,
  });

  if (!company) {
    throw new ApiError(404, "Company Not Found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Company Deleted Successfully."));
});

const createFloor = asyncHandler(async (req, res) => {
  const { floorNumber, assignedCompany, totalSlots } = req.body;

  if (!floorNumber || !assignedCompany || !totalSlots) {
    throw new ApiError(400, "All fields are required!");
  }

  const existingFloor = await Floor.findOne({
    floorNumber,
  });

  if (existingFloor) {
    throw new ApiError(409, "Floor already exist with this number.");
  }

  const floor = await Floor.create({
    floorNumber,
    assignedCompany,
    totalSlots,
    availableSlots: totalSlots,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, floor, "Floor created successfully."));
});

const getAllFloors = asyncHandler(async (req, res) => {
  const floors = await Floor.find()
    .populate("assignedCompany", "name email")
    .sort({ floorNumber: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, floors, "All floors fetched."));
});

const deleteFloor = asyncHandler(async (req, res) => {
    const floor = await  Floor.findByIdAndDelete({
        _id: req.params.id,
    })

  if (!floor) {
    throw new ApiError(404, "Floor not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Floor deleted successfully."));
});


const updateFloor = asyncHandler(async(req, res)=> {
    const updates = req.body;
    const floor = await Floor.findByIdAndUpdate(req.params.id, updates, {
        new: true,
    }).populate("assignedCompany", "name email")

    if (!floor) {
        throw new ApiError(404, "Floor not found!")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, floor, "Floor updated successfully."));
})

const createSlot = asyncHandler(async(req, res)=> {
  const {floorId, slots}= req.body;


  if (!floorId || !slots || !Array.isArray(slots) || slots.length === 0) {
    throw new ApiError(400, "Floor ID and slot numbers are required!")
  }

  const floor = await Floor.findById(floorId).populate("assignedCompany");

  if (!floor) {
    throw new ApiError(404, "Floor not found.");
  }

  const newSlots = slots.map(slotNumber => ({
    slotNumber,
    isOccupied: false,
    floor: floor._id,
    company: floor.assignedCompany?._id || null
  }));

  const createdSlots = await ParkingSlot.insertMany(newSlots)

  floor.availableSlots += createdSlots.length;
  floor.totalSlots += createdSlots.length;
  await floor.save();


  return res
    .status(201)
    .json(new ApiResponse(201, createdSlots, "Parking slots created successfully."));

})

const getParkingSlot = asyncHandler(async(req, res)=> {
  const {floorId, companyId, isOccupied} = req.params;

  if(floorId) filter.floor = floorId;
  if(companyId) filter.company = companyId;
  if(isOccupied !== "undefined") filter.isOccupied = isOccupied === "true";

  const slots = await ParkingSlot.find(filter)
    .populate("floor", "floorNumber")
    .populate("company", "name");
  
  return res
  .status(200)
  .json(
    new ApiResponse(200, slots, "Parking slots fetched successfully.")
  )
})

const updateParkingSlot = asyncHandler(async(req, res)=> {
  const {isOccupied} = req.body;

  const slot = await ParkingSlot.findByIdAndUpdate(
    req.params.id,
    { isOccupied },
    { new: true }
  ).populate("floor", "floorNumber")
   .populate("company", "name");

  if (!slot) {
    throw new ApiError(404, "Parking slot not found.");
  }

  const floor = await Floor.findById(slot.floor);
  if (floor) {
    floor.availableSlots = await ParkingSlot.countDocuments({
      floor: floor._id,
      isOccupied: false
    });
    await floor.save();
  }

  
  return res
    .status(200)
    .json(new ApiResponse(200, slot, "Parking slot updated successfully."));
});

const deleteParkingSlot = asyncHandler(async(req, res)=> {
  const slot = await ParkingSlot.findByIdAndDelete(req.params.id);

  if (!slot) {
    throw new ApiError(404, "Parking slot not found.");
  }

  const floor = await Floor.findById(slot.floor);
  if (floor) {
    floor.totalSlots -= 1;
    if (!slot.isOccupied) {
      floor.availableSlots -= 1;
    }
    await floor.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Parking slot deleted successfully."));
})
export {
  updateParkingSlot,
  deleteParkingSlot, 
  getAllCompanies,
  getParkingSlot, 
  deleteCompany,
  updateCompany,
  getAllFloors,
  createFloor,
  deleteFloor,
  updateFloor,
  addCompany,
  createSlot,
};
