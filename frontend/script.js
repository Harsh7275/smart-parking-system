const API_URL = 'http://localhost:5002/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadSlots();
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('addSlotForm').addEventListener('submit', handleAddSlot);
    document.getElementById('parkVehicleForm').addEventListener('submit', handleParkVehicle);
    document.getElementById('removeVehicleForm').addEventListener('submit', handleRemoveVehicle);
}

// Tabs
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from buttons
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Refresh data when switching to view-slots or park-vehicle
    if (tabName === 'view-slots' || tabName === 'park-vehicle') {
        loadSlots();
    }
}

// Add Slot
async function handleAddSlot(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('addSlotMessage');
    
    try {
        const slotNumber = parseInt(document.getElementById('slotNumber').value);
        const isCovered = document.getElementById('isCovered').checked;
        const isEVCharging = document.getElementById('isEVCharging').checked;

        // Validation: At least one checkbox must be selected
        if (!isCovered && !isEVCharging) {
            showMessage(messageDiv, 'Please select at least one option: Is Covered or EV Charging Available', 'error');
            return;
        }

        const response = await fetch(`${API_URL}/slots`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                slotNo: slotNumber,
                isCovered: isCovered,
                isEVCharging: isEVCharging
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage(messageDiv, `Slot ${slotNumber} added successfully!`, 'success');
            document.getElementById('addSlotForm').reset();
            loadSlots();
        } else {
            showMessage(messageDiv, data.message || 'Error adding slot', 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Error: ' + error.message, 'error');
    }
}

// Load All Slots
async function loadSlots() {
    try {
        const response = await fetch(`${API_URL}/slots`);
        const data = await response.json();

        if (data.success) {
            displaySlots(data.slots);
            updateStats(data.slots);
            populateRemoveSlotSelect(data.slots);
        }
    } catch (error) {
        console.error('Error loading slots:', error);
    }
}

// Display Slots
function displaySlots(slots) {
    const container = document.getElementById('slotsContainer');
    container.innerHTML = '';

    if (slots.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No parking slots added yet.</p>';
        return;
    }

    slots.forEach(slot => {
        const slotCard = createSlotCard(slot);
        container.appendChild(slotCard);
    });
}

// Create Slot Card
function createSlotCard(slot) {
    const card = document.createElement('div');
    card.className = `slot-card ${slot.isOccupied ? 'occupied' : 'available'}`;

    let badgesHTML = '';
    if (slot.isCovered) {
        badgesHTML += '<span class="slot-badge">🏠 Covered</span>';
    }
    if (slot.isEVCharging) {
        badgesHTML += '<span class="slot-badge">⚡ EV Charging</span>';
    }

    card.innerHTML = `
        <div class="slot-number">Slot ${slot.slotNo}</div>
        <div class="slot-info">${badgesHTML}</div>
        <div class="slot-status ${slot.isOccupied ? 'status-occupied' : 'status-available'}">
            ${slot.isOccupied ? '🚗 Occupied' : '✓ Available'}
        </div>
    `;

    return card;
}

// Update Stats
function updateStats(slots) {
    const total = slots.length;
    const occupied = slots.filter(s => s.isOccupied).length;
    const available = total - occupied;

    document.getElementById('totalSlots').textContent = total;
    document.getElementById('occupiedSlots').textContent = occupied;
    document.getElementById('availableSlots').textContent = available;
}

// Populate Remove Slot Select
function populateRemoveSlotSelect(slots) {
    const select = document.getElementById('slotToRemove');
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">-- Choose a slot --</option>';

    const occupiedSlots = slots.filter(s => s.isOccupied);
    occupiedSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.id;
        option.textContent = `Slot ${slot.slotNo} (Occupied)`;
        select.appendChild(option);
    });

    if (occupiedSlots.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No occupied slots';
        option.disabled = true;
        select.appendChild(option);
    }
}

// Park Vehicle
async function handleParkVehicle(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('parkMessage');

    try {
        const needsEV = document.getElementById('needsEV').checked;
        const needsCover = document.getElementById('needsCover').checked;

        const response = await fetch(`${API_URL}/park`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                needsEV: needsEV,
                needsCover: needsCover
            })
        });

        const data = await response.json();

        if (data.success) {
            let requirements = [];
            if (needsEV) requirements.push('EV Charging');
            if (needsCover) requirements.push('Covered');
            
            const reqText = requirements.length > 0 ? ` (${requirements.join(', ')})` : '';
            showMessage(messageDiv, `✓ Vehicle parked successfully in Slot ${data.slot.slotNo}${reqText}!`, 'success');
            document.getElementById('parkVehicleForm').reset();
            loadSlots();
        } else {
            showMessage(messageDiv, `✗ ${data.message}`, 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Error: ' + error.message, 'error');
    }
}

// Remove Vehicle
async function handleRemoveVehicle(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('removeMessage');
    const slotId = document.getElementById('slotToRemove').value;

    if (!slotId) {
        showMessage(messageDiv, 'Please select a slot', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/slots/${slotId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (data.success) {
            showMessage(messageDiv, `✓ Vehicle removed from Slot ${data.slot.slotNo}!`, 'success');
            document.getElementById('removeVehicleForm').reset();
            loadSlots();
        } else {
            showMessage(messageDiv, data.message || 'Error removing vehicle', 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Error: ' + error.message, 'error');
    }
}

// Show Message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message show ${type}`;

    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}
