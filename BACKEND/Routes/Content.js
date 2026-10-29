const router = require("express").Router();
const SiteContent = require("../Models/SiteContent");
const { verifyToken, verifyAdmin } = require("../Middleware/auth");

// Public — get content for a page (returns null data if not yet set)
router.route("/:key").get(async (req, res) => {
  try {
    const content = await SiteContent.findOne({ key: req.params.key });
    res.json(content ? content.data : null);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching content", details: err.message });
  }
});

// Admin only — create or update content for a page
router.route("/:key").put(verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await SiteContent.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, data: req.body },
      { new: true, upsert: true }
    );
    res.json({ status: "Content updated", content: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving content", details: err.message });
  }
});

module.exports = router;