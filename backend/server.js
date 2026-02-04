const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ParkingLotManager = require('./parkingLotManager');

const app = express();
const manager = new ParkingLotManager();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const PORT = 5002;

// Routes

// 1. Add a parking slot
app.post('/api/slots', (req, res) => {
  try {
    const { slotNo, isCovered, isEVCharging } = req.body;

    if (!slotNo || typeof slotNo !== 'number') {
      return res.status(400).json({ success: false, message: "Invalid slot number" });
    }

    // Validation: At least one attribute must be true
    if (!isCovered && !isEVCharging) {
      return res.status(400).json({ success: false, message: "Please select at least one option: Is Covered or EV Charging Available" });
    }

    // Check if slot number already exists
    const existing = manager.slots.find(s => s.slotNo === slotNo);
    if (existing) {
      return res.status(400).json({ success: false, message: "Slot number already exists" });
    }

    const slot = manager.addSlot(slotNo, isCovered, isEVCharging);
    res.status(201).json({ success: true, message: "Slot added successfully", slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Get all parking slots
app.get('/api/slots', (req, res) => {
  try {
    const slots = manager.getAllSlots();
    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Park a vehicle
app.post('/api/park', (req, res) => {
  try {
    const { needsEV, needsCover } = req.body;
    const result = manager.parkVehicle(needsEV || false, needsCover || false);
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Remove a vehicle
app.delete('/api/slots/:slotId', (req, res) => {
  try {
    const slotId = parseInt(req.params.slotId);
    const result = manager.removeVehicle(slotId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Smart Parking Lot System running on http://localhost:${PORT}`);
});
