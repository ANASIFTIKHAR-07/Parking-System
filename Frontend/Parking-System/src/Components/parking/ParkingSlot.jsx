import React from 'react';
import './ParkingSlot.css';

const ParkingSlot = ({ 
  slot, 
  onSelect, 
  isSelected = false, 
  isOccupied = false,
  vehicleInfo = null 
}) => {
  const getSlotStatus = () => {
    if (isOccupied) return 'occupied';
    if (isSelected) return 'selected';
    return 'available';
  };

  const getSlotIcon = () => {
    if (isOccupied) return '🚗';
    return '🅿️';
  };

  return (
    <div 
      className={`parking-slot ${getSlotStatus()}`}
      onClick={() => !isOccupied && onSelect?.(slot)}
    >
      <div className="slot-icon">
        {getSlotIcon()}
      </div>
      <div className="slot-info">
        <div className="slot-number">{slot?.slotNumber || 'N/A'}</div>
        {isOccupied && vehicleInfo && (
          <div className="vehicle-info">
            <div className="vehicle-plate">{vehicleInfo.plateNumber}</div>
            <div className="vehicle-time">{vehicleInfo.entryTime}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingSlot;
