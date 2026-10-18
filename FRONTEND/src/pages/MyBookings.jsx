import { useEffect, useState } from "react";
import api from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

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
      .catch((err) => console.log(err));
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
            {b.status !== "cancelled" && (
              <button onClick={() => handleCancel(b._id)}>Cancel Booking</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;