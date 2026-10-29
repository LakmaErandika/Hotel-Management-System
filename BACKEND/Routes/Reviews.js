const router = require("express").Router();
const Review = require("../Models/Review");
const { verifyToken, verifyAdmin } = require("../Middleware/auth");

// Get all reviews (public)
router.route("/").get((req, res) => {
  Review.find()
    .populate("guest", "name")
    .sort({ createdAt: -1 })
    .then((reviews) => res.json(reviews))
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: "Error fetching reviews", error: err.message });
    });
});

// Add a review (logged-in guest only)
router.route("/add").post(verifyToken, (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  const newReview = new Review({
    guest: req.user.id,
    rating,
    comment
  });

  newReview.save()
    .then(() => res.json("Review submitted"))
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: "Error submitting review", error: err.message });
    });
});

// Delete a review (own review OR admin)
router.route("/delete/:id").delete(verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (review.guest.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed to delete this review" });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ status: "Review deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting review", details: err.message });
  }
});

module.exports = router;