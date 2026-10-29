import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = () => {
    api.get("/booking/my-bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = (id) => {
    api.put(`/booking/cancel/${id}`)
      .then(() => fetchBookings())
      .catch((err) => alert(err.response?.data?.error || "Error cancelling booking"));
  };

  return (
    <div className="page">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="empty-state">You have no bookings yet.</p>
      ) : (
        bookings.map((b) => (
          <div className="booking-card" key={b._id}>
            <h3 style={{ marginBottom: "6px" }}>
              Room {b.room?.roomNumber} · {b.room?.type}
            </h3>
            <p>Check-in: {new Date(b.checkInDate).toLocaleDateString()}</p>
            <p>Check-out: {new Date(b.checkOutDate).toLocaleDateString()}</p>
            <p>Guests: {b.adults} adult{b.adults > 1 ? "s" : ""}{b.children > 0 ? `, ${b.children} child${b.children > 1 ? "ren" : ""}` : ""}</p>
            <p>Total: Rs. {b.totalPrice}</p>
            <p>
              Status: <span className={`status-${b.status}`}>{b.status}</span>
              {"  ·  "}
              Payment: <span className={b.paymentStatus === "paid" ? "status-confirmed" : "status-pending"}>
                {b.paymentStatus}
              </span>
            </p>

            {b.status === "confirmed" && b.paymentStatus === "unpaid" && (
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button onClick={() => navigate(`/payment/${b._id}`)}>Pay Now</button>
                <button className="btn-danger" onClick={() => handleCancel(b._id)}>Cancel Booking</button>
              </div>
            )}

            {b.paymentStatus === "paid" && (
              <p className="status-confirmed" style={{ marginTop: "8px" }}>
                Booking confirmed and paid.
              </p>
            )}

            {b.status === "cancelled" && (
              <p className="status-cancelled" style={{ marginTop: "8px" }}>
                This booking was cancelled.
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;