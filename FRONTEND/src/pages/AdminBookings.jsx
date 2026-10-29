import { useEffect, useState } from "react";
import api from "../services/api";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => {
    api.get("/booking")
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = (id) => {
    api.delete(`/booking/delete/${id}`)
      .then(() => fetchBookings())
      .catch((err) => alert(err.response?.data?.error || "Error deleting booking"));
  };

  return (
    <div className="page">
      <h1>Manage Bookings</h1>
      {bookings.length === 0 ? (
        <p className="empty-state">No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div className="booking-card" key={b._id}>
            <h3 style={{ marginBottom: "6px" }}>
              Room {b.room?.roomNumber} · {b.room?.type}
            </h3>
            <p>Guest: {b.guest?.name} ({b.guest?.email})</p>
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

            {b.paymentStatus === "paid" ? (
              <p className="status-confirmed" style={{ marginTop: "8px" }}>
                Payment received — this booking is locked and cannot be deleted.
              </p>
            ) : (
              <button className="btn-danger" style={{ marginTop: "8px" }} onClick={() => handleDelete(b._id)}>
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminBookings;