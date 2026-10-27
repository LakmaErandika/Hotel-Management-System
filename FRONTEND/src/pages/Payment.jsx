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
  const [error, setError] = useState("");

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    // Simulated payment — no real card processing
    setTimeout(() => {
      api.put(`/booking/confirm-payment/${bookingId}`)
        .then(() => {
          alert("Payment successful!");
          navigate("/my-bookings");
        })
        .catch((err) => {
          console.log(err);
          setError(err.response?.data?.error || "Payment failed");
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={processing}>
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}

export default Payment;