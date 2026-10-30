const router = require("express").Router();
const ContactMessage = require("../Models/ContactMessage");
const { verifyToken, verifyAdmin, optionalAuth } = require("../Middleware/auth");

// Anyone can send a message; if logged in, it's linked to their account
router.route("/add").post(optionalAuth, async (req, res) => {
  const { name, email, message } = req.body;

  if (req.user && req.user.role === "admin") {
    return res.status(403).json({ error: "Admins cannot send contact messages" });
  }

  try {
    const newMessage = new ContactMessage({
      guest: req.user ? req.user.id : null,
      name,
      email,
      message
    });
    await newMessage.save();
    res.json({ status: "Message sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error sending message", details: err.message });
  }
});

// Logged-in guest: their own messages and any replies
router.route("/my-messages").get(verifyToken, async (req, res) => {
  try {
    const messages = await ContactMessage.find({ guest: req.user.id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching messages", details: err.message });
  }
});

// Admin: all messages
router.route("/").get(verifyToken, verifyAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching messages", details: err.message });
  }
});

// Admin: reply to a message
router.route("/reply/:id").put(verifyToken, verifyAdmin, async (req, res) => {
  const { reply } = req.body;

  if (!reply || !reply.trim()) {
    return res.status(400).json({ error: "Reply cannot be empty" });
  }

  try {
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { reply: reply.trim(), repliedAt: new Date(), read: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Message not found" });
    res.json({ status: "Reply saved", message: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving reply", details: err.message });
  }
});

// Admin: mark as read
router.route("/read/:id").put(verifyToken, verifyAdmin, async (req, res) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ status: "Marked as read" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating message", details: err.message });
  }
});

// Admin: delete
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