const router = require("express").Router();
const Room = require("../Models/Room");
const { verifyToken, verifyAdmin } = require("../Middleware/auth");
const Booking = require("../Models/Booking"); 


// Add a new room
router.route("/add").post(verifyToken, verifyAdmin, (req, res) => {
  const roomNumber = req.body.roomNumber;
  const type = req.body.type;
  const pricePerNight = Number(req.body.pricePerNight);
  const isAvailable = req.body.isAvailable;

  const newRoom = new Room({
    roomNumber,
    type,
    pricePerNight,
    isAvailable
  });

  newRoom.save()
    .then(() => {
      res.json("Room Added");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: "Error adding room", error: err.message });
    });
});

// Get all rooms
router.route("/").get((req, res) => {
  Room.find()
    .then((rooms) => {
      res.json(rooms);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: "Error fetching rooms", error: err.message });
    });
});

// Update a room
router.route("/update/:id").put(verifyToken, verifyAdmin, async (req, res) => {
  let roomId = req.params.id;
  const { roomNumber, type, pricePerNight, isAvailable } = req.body;

  const updateRoom = {
    roomNumber,
    type,
    pricePerNight,
    isAvailable
  };

  await Room.findByIdAndUpdate(roomId, updateRoom)
    .then(() => {
      res.status(200).send({ status: "Room updated" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: "Error with updating data", error: err.message });
    });
});

// Delete a room
router.route("/delete/:id").delete(verifyToken, verifyAdmin, async (req, res) => {
  let roomId = req.params.id;

  await Room.findByIdAndDelete(roomId)
    .then(() => {
      res.status(200).send({ status: "Room deleted" });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: "Error with delete room", error: err.message });
    });
});

// Search rooms available for specific dates
router.route("/search").get(async (req, res) => {
  const { checkInDate, checkOutDate } = req.query;

  if (!checkInDate || !checkOutDate) {
    return res.status(400).json({ error: "checkInDate and checkOutDate are required" });
  }

  try {
    const allRooms = await Room.find({ isAvailable: true }); // exclude admin-closed rooms

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


// Get a single room
router.route("/get/:id").get(async (req, res) => {
  let roomId = req.params.id;

  await Room.findById(roomId)
    .then((room) => {
      res.status(200).send({ status: "Room fetched", room: room });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: "Error with get room", error: err.message });
    });
});


module.exports = router;


