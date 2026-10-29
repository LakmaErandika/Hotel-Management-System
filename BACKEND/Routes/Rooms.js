const router = require("express").Router();
const Room = require("../Models/room");
const Booking = require("../Models/Booking");
const { verifyToken, verifyAdmin } = require("../Middleware/auth");

// Add a new room (admin only) — new rooms go to the end of the order
router.route("/add").post(verifyToken, verifyAdmin, async (req, res) => {
  const { roomNumber, type, pricePerNight, isAvailable, description, facilities, imageUrl, maxOccupancy } = req.body;

  try {
    const roomCount = await Room.countDocuments();

    const newRoom = new Room({
      roomNumber,
      type,
      pricePerNight,
      isAvailable,
      description,
      facilities,
      imageUrl,
      maxOccupancy,
      order: roomCount
    });

    await newRoom.save();
    res.json("Room Added");
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error adding room", error: err.message });
  }
});

// Get all rooms, sorted by admin-defined order
router.route("/").get((req, res) => {
  Room.find()
    .sort({ order: 1, createdAt: 1 })
    .then((rooms) => res.json(rooms))
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: "Error fetching rooms", error: err.message });
    });
});

// Search rooms available for specific dates, sorted by order
router.route("/search").get(async (req, res) => {
  const { checkInDate, checkOutDate } = req.query;

  if (!checkInDate || !checkOutDate) {
    return res.status(400).json({ error: "checkInDate and checkOutDate are required" });
  }

  try {
    const allRooms = await Room.find({ isAvailable: true }).sort({ order: 1, createdAt: 1 });

    const overlappingBookings = await Booking.find({
      status: "confirmed",
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) }
    }).select("room");

    const bookedRoomIds = overlappingBookings.map((b) => b.room.toString());

    const availableRooms = allRooms.filter(
      (room) => !bookedRoomIds.includes(room._id.toString())
    );

    res.json(availableRooms);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error searching rooms", details: err.message });
  }
});

// Move a room up or down in display order (admin only)
router.route("/reorder").put(verifyToken, verifyAdmin, async (req, res) => {
  const { roomId, direction } = req.body;

  try {
    const rooms = await Room.find().sort({ order: 1, createdAt: 1 });
    const index = rooms.findIndex((r) => r._id.toString() === roomId);

    if (index === -1) {
      return res.status(404).json({ error: "Room not found" });
    }

    let swapIndex;
    if (direction === "up") swapIndex = index - 1;
    else if (direction === "down") swapIndex = index + 1;
    else return res.status(400).json({ error: "Invalid direction" });

    if (swapIndex < 0 || swapIndex >= rooms.length) {
      return res.status(400).json({ error: "Cannot move further in that direction" });
    }

    // Move the room within the array, then renumber everything 0..n-1
    const [moved] = rooms.splice(index, 1);
    rooms.splice(swapIndex, 0, moved);

    await Promise.all(
      rooms.map((room, i) => Room.findByIdAndUpdate(room._id, { order: i }))
    );

    res.json({ status: "Room order updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error reordering rooms", details: err.message });
  }
});

// Get a single room
router.route("/get/:id").get(async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.status(200).send({ status: "Room fetched", room });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error fetching room", error: err.message });
  }
});

// Update a room (admin only)
router.route("/update/:id").put(verifyToken, verifyAdmin, async (req, res) => {
  const { roomNumber, type, pricePerNight, isAvailable, description, facilities, imageUrl, maxOccupancy } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { roomNumber, type, pricePerNight, isAvailable, description, facilities, imageUrl, maxOccupancy },
      { new: true }
    );
    if (!updatedRoom) return res.status(404).json({ error: "Room not found" });
    res.json("Room updated successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error updating room", error: err.message });
  }
});

// Delete a room (admin only)
router.route("/delete/:id").delete(verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) return res.status(404).json({ error: "Room not found" });
    res.json("Room deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error deleting room", error: err.message });
  }
});

module.exports = router;