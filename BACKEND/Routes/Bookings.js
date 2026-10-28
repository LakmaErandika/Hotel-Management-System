const router = require("express").Router();
const Booking = require("../Models/Booking");
const Room = require("../Models/Room");
const { verifyToken, verifyAdmin } = require("../Middleware/auth");

// Checks if a room has any CONFIRMED, PAID-or-not booking that overlaps the given dates
async function hasOverlappingBooking(roomId, checkIn, checkOut, excludeBookingId = null) {
  const query = {
    room: roomId,
    status: "confirmed", // only confirmed bookings block the room
    checkInDate: { $lt: new Date(checkOut) },
    checkOutDate: { $gt: new Date(checkIn) }
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflict = await Booking.findOne(query);
  return !!conflict;
}

// Create a booking REQUEST, checked against existing bookings' dates
router.route("/add").post(verifyToken, async (req, res) => {
  const { room, checkInDate, checkOutDate } = req.body;

  try {
    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (!roomData.isAvailable) {
      return res.status(400).json({ error: "This room is currently closed for booking" });
    }

    const nights = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0) {
      return res.status(400).json({ error: "Check-out must be after check-in" });
    }

    const overlap = await hasOverlappingBooking(room, checkInDate, checkOutDate);
    if (overlap) {
      return res.status(400).json({ error: "This room is already booked for the selected dates" });
    }

    const totalPrice = nights * roomData.pricePerNight;

    const newBooking = new Booking({
      guest: req.user.id,// comes from the verified token, not the request body
      room,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "confirmed"// auto-confirmed, no admin approval needed
    });

    await newBooking.save();
    res.json({ status: "Booking created", booking: newBooking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating booking", details: err.message });
  }
});

// Guest's own bookings
router.route("/my-bookings").get(verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user.id }).populate("room");
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching bookings", details: err.message });
  }
});

// Admin: all bookings
router.route("/").get(verifyToken, verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("guest", "name email phone")
      .populate("room");
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching bookings", details: err.message });
  }
});

// Guest cancels their own booking — blocked if already paid
router.route("/cancel/:id").put(verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.guest.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not your booking" });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ error: "Cannot cancel a booking that has already been paid" });
    }

    booking.status = "cancelled";
    await booking.save();
    // No isAvailable toggle needed — availability is calculated dynamically from dates now
    res.json({ status: "Booking cancelled" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error cancelling booking", details: err.message });
  }
});

// Guest pays for their own booking
router.route("/confirm-payment/:id").put(verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.guest.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not your booking" });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ error: "This booking has already been paid" });
    }

    booking.paymentStatus = "paid";
    await booking.save();
    res.json({ status: "Payment confirmed", booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error confirming payment", details: err.message });
  }
});

// Admin deletes a booking — blocked if already paid
router.route("/delete/:id").delete(verifyToken, verifyAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ error: "Cannot delete a booking that has already been paid" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ status: "Booking deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting booking", details: err.message });
  }
});

module.exports = router;