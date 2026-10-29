import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const fetchReviews = () => {
    api.get("/review")
      .then((res) => setReviews(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    api.post("/review/add", { rating: Number(newRating), comment: newComment })
      .then(() => {
        setNewComment("");
        setNewRating(5);
        fetchReviews();
      })
      .catch((err) => alert(err.response?.data?.error || "Error submitting review"));
  };

  return (
    <div className="page">
      <h1>Guest Reviews</h1>

      {user && user.role === "guest" && (
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <select value={newRating} onChange={(e) => setNewRating(e.target.value)}>
            <option value={5}>5 — Excellent</option>
            <option value={4}>4 — Very Good</option>
            <option value={3}>3 — Good</option>
            <option value={2}>2 — Fair</option>
            <option value={1}>1 — Poor</option>
          </select>
          <input
            type="text"
            placeholder="Share your experience..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type="submit">Post Review</button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="empty-state">No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div className="review-card" key={r._id}>
            <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
            <p>{r.comment}</p>
            <span className="review-author">— {r.guest?.name || "Guest"}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default Reviews;