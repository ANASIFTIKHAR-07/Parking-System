import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ParkingLog from "../models/parkingLog.model.js";
import { Parser } from "json2csv";


export const exportParkingLogsCSV = asyncHandler(async (req, res) => {
    const { company, vehicleNumber, floor, slotNumber, employeeName, rfid, startDate, endDate } = req.query;
  
    let filters = {};
  
    if (company) filters.company = company;
    if (vehicleNumber) filters.vehicleNumber = { $regex: vehicleNumber, $options: "i" };
    if (floor) filters.floor = floor;
    if (slotNumber) filters.slotNumber = { $regex: slotNumber, $options: "i" };
    if (employeeName) filters.employeeName = { $regex: employeeName, $options: "i" };
    if (rfid) filters.rfidTag = rfid;
  
    // Date range filter
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }
  
    const logs = await ParkingLog.find(filters)
      .populate("company", "name")
      .populate("floor", "floorNumber")
      .sort({ createdAt: -1 })
      .lean();
  
    if (!logs.length) {
      throw new ApiError(404, "No parking logs found with the given filters.");
    }
  
    // Prepare data for CSV
    const csvData = logs.map(log => ({
      Company: log.company?.name || "N/A",
      VehicleNumber: log.vehicleNumber || "N/A",
      Floor: log.floor?.floorNumber || "N/A",
      SlotNumber: log.slotNumber || "N/A",
      EmployeeName: log.employeeName || "N/A",
      RFID: log.rfidTag || "N/A",
      CheckInTime: log.checkInTime ? new Date(log.checkInTime).toLocaleString() : "N/A",
      CheckOutTime: log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : "N/A",
      CreatedAt: new Date(log.createdAt).toLocaleString()
    }));
  
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);
  
    // Return CSV inside JSON response
    return res
      .status(200)
      .json(new ApiResponse(200, { csv }, "Parking logs exported successfully."));
  });
  