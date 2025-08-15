import { Parser } from 'json2csv';
import ParkingLog from '../models/ParkingLog.js';

export const exportParkingLogsCSV = async (req, res) => {
    try {
        const { startDate, endDate, company, floor, vehicleType, vehicleNumber } = req.query;
        const filter = {};

        // Date filter (UTC safe)
        if (startDate || endDate) {
            filter.checkInTime = {};
            if (startDate) filter.checkInTime.$gte = new Date(startDate + 'T00:00:00Z');
            if (endDate) filter.checkInTime.$lte = new Date(endDate + 'T23:59:59Z');
        }

        if (company) filter.company = company;
        if (floor) filter.floor = floor;
        if (vehicleType) filter.vehicleType = vehicleType;
        if (vehicleNumber) filter.vehicleNumber = { $regex: vehicleNumber, $options: 'i' };

        const logs = await ParkingLog.find(filter)
            .populate('company', 'name')
            .populate('floor', 'name')
            .populate('vehicle', 'vehicleNumber vehicleType')
            .lean();

        if (!logs.length) {
            return res.status(404).json({ message: 'No parking logs found' });
        }

        const csvData = logs.map(log => ({
            Company: log.company?.name || '',
            Floor: log.floor?.name || '',
            VehicleNumber: log.vehicle?.vehicleNumber || '',
            VehicleType: log.vehicle?.vehicleType || '',
            CheckInTime: log.checkInTime ? new Date(log.checkInTime).toISOString() : '',
            CheckOutTime: log.checkOutTime ? new Date(log.checkOutTime).toISOString() : '',
            DurationMinutes: log.duration || '',
            Charges: log.charges || '',
        }));

        const json2csv = new Parser();
        const csv = json2csv.parse(csvData);

        res.header('Content-Type', 'text/csv');
        res.attachment(`parking_logs_${Date.now()}.csv`);
        res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error exporting CSV' });
    }
};
