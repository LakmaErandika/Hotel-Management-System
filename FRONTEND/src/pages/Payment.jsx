import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulated payment — no real card processing
    setTimeout(() => {
      api.put(`/booking/update-status/${bookingId}`, { status: "confirmed" })
        .then(() => {
          alert("Payment successful! Booking confirmed.");
          navigate("/my-bookings");
        })
        .catch((err) => {
          console.log(err);
          alert("Something went wrong confirming your booking.");
        })
        .finally(() => setProcessing(false));
    }, 1000); // fake delay to simulate processing
  };

  return (
    <div>
      <h1>Payment</h1>
      <p>This is a dummy payment gateway for demonstration purposes.</p>
      <form onSubmit={handlePay}>
        <input
          type="text"
          placeholder="Card Number (any digits)"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="MM/YY"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />
        <br />
        <button type="submit" disabled={processing}>
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}

export default Payment;