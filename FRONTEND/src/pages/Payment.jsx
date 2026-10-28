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

  const validate = () => {
    if (!/^\d+$/.test(cardNumber)) {
      return "Card number must contain only digits.";
    }
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return "Card number must be between 13 and 19 digits.";
    }

    const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch) {
      return "Expiry date must be in MM/YY format.";
    }

    const month = parseInt(expiryMatch[1], 10);
    const year = parseInt(expiryMatch[2], 10);

    if (month < 1 || month > 12) {
      return "Expiry month must be between 01 and 12.";
    }

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "Card has expired. Please use a valid expiry date.";
    }

    if (!/^\d{3}$/.test(cvv)) {
      return "CVV must be exactly 3 digits.";
    }

    return null;
  };

  const handlePay = (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setProcessing(true);

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
    }, 1000);
  };

  return (
    <div className="form-panel">
      <h2>Payment</h2>
      <p style={{ marginTop: "-8px" }}>Dummy payment gateway for demonstration purposes.</p>
      <form onSubmit={handlePay}>
        <input
          type="text"
          placeholder="Card Number (13-19 digits)"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          maxLength={19}
          required
        />
        <input
          type="text"
          placeholder="MM/YY"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          maxLength={5}
          required
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          maxLength={3}
          required
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={processing}>
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}

export default Payment;