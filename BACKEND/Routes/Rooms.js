const router = require("express").Router();
const Room = require("../models/Room");

// Add a new room
router.route("/add").post((req, res) => {
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
router.route("/update/:id").put(async (req, res) => {
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
router.route("/delete/:id").delete(async (req, res) => {
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