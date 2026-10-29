const router = require("express").Router();
const ContactMessage = require("../Models/ContactMessage");
const { verifyToken, verifyAdmin } = require("../Middleware/auth");

// Public — anyone (guest or visitor) can send a message
router.route("/add").post(async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();
    res.json({ status: "Message sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error sending message", details: err.message });
  }
});

// Admin only — view all messages
router.route("/").get(verifyToken, verifyAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching messages", details: err.message });
  }
});

// Admin only — mark as read
router.route("/read/:id").put(verifyToken, verifyAdmin, async (req, res) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ status: "Marked as read" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating message", details: err.message });
  }
});

// Admin only — delete
router.route("/delete/:id").delete(verifyToken, verifyAdmin, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ status: "Message deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting message", details: err.message });
  }
});

module.exports = router;