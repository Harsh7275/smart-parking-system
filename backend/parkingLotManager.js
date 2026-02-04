class ParkingLotManager {
  constructor() {
    this.slots = [];
    this.nextSlotId = 1;
  }

  // Add a new parking slot
  addSlot(slotNo, isCovered, isEVCharging) {
    const slot = {
      id: this.nextSlotId++,
      slotNo: slotNo,
      isCovered: isCovered,
      isEVCharging: isEVCharging,
      isOccupied: false,
      vehicleId: null
    };
    this.slots.push(slot);
    return slot;
  }

  // Get all parking slots
  getAllSlots() {
    return this.slots.sort((a, b) => a.slotNo - b.slotNo);
  }

  // Get available slots that match criteria
  getAvailableSlots(needsEV, needsCover) {
    return this.slots.filter(slot => 
      !slot.isOccupied &&
      (!needsEV || slot.isEVCharging) &&
      (!needsCover || slot.isCovered)
    ).sort((a, b) => a.slotNo - b.slotNo);
  }

  // Park a vehicle - allocate nearest available matching slot
  parkVehicle(needsEV, needsCover) {
    const availableSlots = this.getAvailableSlots(needsEV, needsCover);
    
    if (availableSlots.length === 0) {
      return {
        success: false,
        message: "No slot available",
        slot: null
      };
    }

    // Get the nearest (first/lowest slot number) available slot
    const slot = availableSlots[0];
    slot.isOccupied = true;
    slot.vehicleId = `VEHICLE_${Date.now()}`;

    return {
      success: true,
      message: "Vehicle parked successfully",
      slot: slot
    };
  }

  // Remove a vehicle from a slot
  removeVehicle(slotId) {
    const slot = this.slots.find(s => s.id === slotId);
    
    if (!slot) {
      return {
        success: false,
        message: "Slot not found"
      };
    }

    if (!slot.isOccupied) {
      return {
        success: false,
        message: "Slot is already empty"
      };
    }

    slot.isOccupied = false;
    slot.vehicleId = null;

    return {
      success: true,
      message: "Vehicle removed successfully",
      slot: slot
    };
  }

  // Get slot by ID
  getSlotById(slotId) {
    return this.slots.find(s => s.id === slotId);
  }
}

module.exports = ParkingLotManager;
