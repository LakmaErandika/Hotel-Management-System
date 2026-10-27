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

  const handleStatusChange = (id, status) => {
    api.put(`/booking/update-status/${id}`, { status })
      .then(() => fetchBookings())
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    api.delete(`/booking/delete/${id}`)
      .then(() => fetchBookings())
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>Manage Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <p>Guest: {b.guest?.name} ({b.guest?.email})</p>
            <p>Room: {b.room?.roomNumber} ({b.room?.type})</p>
            <p>Check-in: {new Date(b.checkInDate).toLocaleDateString()}</p>
            <p>Check-out: {new Date(b.checkOutDate).toLocaleDateString()}</p>
            <p>Total: Rs. {b.totalPrice}</p>
            <p>Status: {b.status}</p>
            <p>Payment: {b.paymentStatus}</p>
             {/*<button onClick={() => handleStatusChange(b._id, "confirmed")}>Confirm</button>
            {" "}
            <button onClick={() => handleStatusChange(b._id, "cancelled")}>Cancel</button>
            {" "}
            <button onClick={() => handleDelete(b._id)}>Delete</button>*/}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminBookings;