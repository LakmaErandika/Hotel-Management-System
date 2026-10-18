const router = require("express").Router();
const Booking = require("../Models/Booking");
const Room = require("../models/Room");
const { verifyToken, verifyAdmin } = require("../Middleware/auth");

// Create a booking (logged-in guest only)
router.route("/add").post(verifyToken, async (req, res) => {
  const { room, checkInDate, checkOutDate } = req.body;

  try {
    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.status(404).json({ error: "Room not found" });
    }

    const nights = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0) {
      return res.status(400).json({ error: "Check-out must be after check-in" });
    }

    const totalPrice = nights * roomData.pricePerNight;

    const newBooking = new Booking({
      guest: req.user.id, // comes from the verified token, not the request body
      room,
      checkInDate,
      checkOutDate,
      totalPrice
    });

    await newBooking.save();
    res.json({ status: "Booking created", booking: newBooking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating booking", details: err.message });
  }
});

// Get logged-in guest's own bookings
router.route("/my-bookings").get(verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user.id })
      .populate("room");
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching bookings", details: err.message });
  }
});

// Get all bookings (admin only)
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

// Cancel own booking (guest)
router.route("/cancel/:id").put(verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.guest.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not your booking" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json({ status: "Booking cancelled" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error cancelling booking", details: err.message });
  }
});

// Update booking status (admin only — confirm/cancel)
router.route("/update-status/:id").put(verifyToken, verifyAdmin, async (req, res) => {
  const { status } = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ status: "Booking status updated", booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating booking", details: err.message });
  }
});

// Delete a booking (admin only)
router.route("/delete/:id").delete(verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ status: "Booking deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting booking", details: err.message });
  }
});

// Guest confirms their own payment (dummy)
router.route("/confirm-payment/:id").put(verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.guest.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not your booking" });
    }

    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

    res.json({ status: "Payment confirmed", booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error confirming payment", details: err.message });
  }
});

module.exports = router;
