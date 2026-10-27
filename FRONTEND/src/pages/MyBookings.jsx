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
    <div>
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <p>Room: {b.room?.roomNumber} ({b.room?.type})</p>
            <p>Check-in: {new Date(b.checkInDate).toLocaleDateString()}</p>
            <p>Check-out: {new Date(b.checkOutDate).toLocaleDateString()}</p>
            <p>Total: Rs. {b.totalPrice}</p>
            <p>Status: {b.status}</p>
            <p>Payment: {b.paymentStatus}</p>

            {b.status === "confirmed" && b.paymentStatus === "unpaid" && (
              <>
                <button onClick={() => navigate(`/payment/${b._id}`)}>Pay Now</button>
                {" "}
                <button onClick={() => handleCancel(b._id)}>Cancel Booking</button>
              </>
            )}

            {b.paymentStatus === "paid" && (
              <p style={{ color: "green" }}>Booking confirmed and paid.</p>
            )}

            {b.status === "cancelled" && (
              <p>This booking was cancelled.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;