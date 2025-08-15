// controllers/log.controller.js
import ParkingLog from '../models/ParkingLog.js';
import { createObjectCsvStringifier } from 'csv-writer';

export const exportParkingLogs = async (req, res) => {
  try {
    const { startDate, endDate, companyId, employeeId } = req.query;
    const filter = {};

    // Optional date filtering
    if (startDate || endDate) {
      filter.checkInTime = {};
      if (startDate) filter.checkInTime.$gte = new Date(`${startDate}T00:00:00Z`);
      if (endDate) filter.checkInTime.$lte = new Date(`${endDate}T23:59:59Z`);
    }

    // Optional company filter
    if (companyId) filter.company = companyId;

    // Optional employee filter
    if (employeeId) filter.employee = employeeId;

    const logs = await ParkingLog.find(filter)
      .populate('vehicle', 'plateNumber')
      .populate('company', 'name')
      .populate('floor', 'name')
      .populate('slot', 'slotNumber');

    // CSV setup
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'plateNumber', title: 'Plate Number' },
        { id: 'company', title: 'Company' },
        { id: 'floor', title: 'Floor' },
        { id: 'slot', title: 'Slot' },
        { id: 'checkInTime', title: 'Check-in Time' },
        { id: 'checkOutTime', title: 'Check-out Time' },
      ],
    });

    const csvData = logs.map(log => ({
      plateNumber: log.vehicle?.plateNumber || '',
      company: log.company?.name || '',
      floor: log.floor?.name || '',
      slot: log.slot?.slotNumber || '',
      checkInTime: log.checkInTime?.toISOString() || '',
      checkOutTime: log.checkOutTime?.toISOString() || '',
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=parking_logs.csv');

    res.send(csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to export logs', error: err.message });
  }
};
