# Smart Parking Lot System

A complete web-based application for managing and allocating parking slots automatically.

## Features

✅ **Add Parking Slot** - Add new parking slots with customizable attributes
✅ **View All Slots** - Display all parking slots with real-time status
✅ **Park Vehicle** - Automatic allocation of nearest available matching slot
✅ **Remove Vehicle** - Free up a parking slot

## Architecture

- **Backend**: Node.js with Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Communication**: REST API with JSON

## Project Structure

```
smart-parking1/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── parkingLotManager.js
└── frontend/
    ├── index.html
    ├── styles.css
    └── script.js
```

## Data Model

| Field        | Type    | Description                      |
| ------------ | ------- | -------------------------------- |
| slotNo       | number  | Unique slot number               |
| isCovered    | boolean | Whether the slot is covered      |
| isEVCharging | boolean | Whether EV charging is available |
| isOccupied   | boolean | Current occupancy status         |
| vehicleId    | string  | Identifier for parked vehicle    |

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Open `index.html` in a web browser (use a local server for best results):

```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js (http-server)
npx http-server
```

3. Access the application at `http://localhost:8000`

## API Endpoints

### 1. Add a Parking Slot

- **Method**: POST
- **Endpoint**: `/api/slots`
- **Request Body**:

```json
{
  "slotNo": 101,
  "isCovered": true,
  "isEVCharging": false
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Slot added successfully",
  "slot": {
    "id": 1,
    "slotNo": 101,
    "isCovered": true,
    "isEVCharging": false,
    "isOccupied": false,
    "vehicleId": null
  }
}
```

### 2. Get All Parking Slots

- **Method**: GET
- **Endpoint**: `/api/slots`
- **Response**:

```json
{
  "success": true,
  "slots": [...]
}
```

### 3. Park a Vehicle

- **Method**: POST
- **Endpoint**: `/api/park`
- **Request Body**:

```json
{
  "needsEV": true,
  "needsCover": false
}
```

- **Response** (Success):

```json
{
  "success": true,
  "message": "Vehicle parked successfully",
  "slot": {
    "id": 1,
    "slotNo": 101,
    "isOccupied": true,
    "vehicleId": "VEHICLE_1234567890"
  }
}
```

- **Response** (No Available Slot):

```json
{
  "success": false,
  "message": "No slot available",
  "slot": null
}
```

### 4. Remove a Vehicle

- **Method**: DELETE
- **Endpoint**: `/api/slots/:slotId`
- **Response**:

```json
{
  "success": true,
  "message": "Vehicle removed successfully",
  "slot": {
    "isOccupied": false,
    "vehicleId": null
  }
}
```

## Usage Guide

### Adding a Slot

1. Click **"Add Slot"** tab
2. Enter Slot Number (must be unique)
3. Check **"Is Covered"** if the slot is covered
4. Check **"EV Charging Available"** if charging is available
5. Click **"Add Slot"** button

### Viewing All Slots

1. Click **"View All Slots"** tab
2. See statistics (Total, Occupied, Available)
3. View all slots with their attributes
4. Color indicators:
   - 🔵 Blue = Available
   - 🔴 Red = Occupied

### Parking a Vehicle

1. Click **"Park Vehicle"** tab
2. Check **"Needs EV Charging"** if required
3. Check **"Needs Covered Slot"** if required
4. Click **"Find and Park Vehicle"** button
5. System allocates the nearest available matching slot
6. If no suitable slot: **"No slot available"** message

### Removing a Vehicle

1. Click **"Park Vehicle"** tab
2. Select an occupied slot from the dropdown
3. Click **"Remove Vehicle"** button
4. Slot becomes available

## Parking Algorithm

The `ParkVehicle(needsEV, needsCover)` function:

1. Filters all slots by:
   - Not occupied
   - EV Charging requirement (if needed)
   - Covered requirement (if needed)

2. Selects the **nearest** (lowest slot number) available slot

3. Returns:
   - Success with slot details if found
   - "No slot available" message if no match

## Technologies Used

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Body-parser** - Request body parsing
- **Fetch API** - Frontend HTTP client
- **CSS Grid & Flexbox** - Responsive layout

## Key Features

✨ **Real-time Updates** - Slots update immediately after actions
✨ **Smart Allocation** - Nearest slot algorithm for optimal parking
✨ **Responsive Design** - Works on desktop and mobile
✨ **Input Validation** - Prevents duplicate slots and invalid data
✨ **Status Display** - Clear visual feedback for all operations
✨ **Statistics Dashboard** - Quick overview of parking status

## Testing

### Test Case 1: Basic Workflow

1. Add 5 slots (mix of covered/EV charging)
2. View all slots - verify they appear
3. Park vehicle (no requirements)
4. Park vehicle (needs EV)
5. Remove vehicle
6. Verify slot is available again

### Test Case 2: No Slot Available

1. Add 1 covered slot with EV charging
2. Park vehicle (no requirements)
3. Try to park another vehicle (no requirements)
4. Should show "No slot available"

### Test Case 3: Filtering

1. Add multiple slots with different attributes
2. Park vehicle (needs EV) - should allocate EV charging slot
3. Park vehicle (needs cover) - should allocate covered slot
4. Park vehicle (needs both) - should allocate matching slot

### Test Case 4: Validation

1. Add parking slots (needs validation)- minimum one slot select EV charging or covered
2. If we select both (covered and EV charging)- valid to add new slots

## Future Enhancements

- Database persistence (MongoDB/PostgreSQL)
- User authentication
- Reservation system
- Payment integration
- Real-time notifications
- Admin dashboard
- Vehicle history/logs
- Dynamic pricing

## License

ISC

## Author

Harsh Patel - Smart Parking Lot System
