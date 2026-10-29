import { useState, useRef, useEffect } from "react";

const FAQ = [
  {
    keywords: ["book a room", "how to book", "reserve", "reservation"],
    answer: "To book a room, browse the Rooms page, click \"Book Now\" on an available room, pick your check-in and check-out dates, then continue to payment."
  },
  {
    keywords: ["available", "availability", "find room", "search room", "vacant"],
    answer: "You can see all available rooms on the Rooms page — each listing shows the room type, price per night, and whether it's currently available or fully booked."
  },
  {
    keywords: ["pay", "payment", "card", "cvv"],
    answer: "Payment happens right after you confirm a booking. We accept any 13-19 digit card number with a valid future expiry date (MM/YY) and a 3-digit CVV."
  },
  {
    keywords: ["cancel", "cancellation"],
    answer: "You can cancel a booking from the \"My Bookings\" page, as long as it hasn't been paid yet. Once a booking is paid, it can no longer be cancelled."
  },
  {
    keywords: ["check-in", "checkin", "check in", "arrival"],
    answer: "Standard check-in time is 2:00 PM and check-out is 11:00 AM. Early check-in may be available on request."
  },
  {
    keywords: ["check-out", "checkout", "check out", "departure"],
    answer: "Check-out time is 11:00 AM. Late check-out may be available depending on room availability."
  },
  {
    keywords: ["price", "cost", "rate", "night"],
    answer: "Room prices vary by type and are shown per night on the Rooms page. Your total is calculated automatically based on your selected dates."
  },
  {
    keywords: ["room type", "deluxe", "single", "double", "suite"],
    answer: "We offer a range of room types including Single, Deluxe, and Suite, each with different pricing. Check the Rooms page for current availability."
  },
  {
    keywords: ["account", "register", "sign up", "login"],
    answer: "You can create an account from the Register page, then log in to book rooms and manage your bookings."
  },
  {
    keywords: ["my bookings", "status", "confirmed", "pending"],
    answer: "You can view all your bookings, their status, and payment status under \"My Bookings\" after logging in."
  },
  {
    keywords: ["admin", "manage room", "add room"],
    answer: "Hotel staff with an admin account can add, edit, or remove rooms, and manage all guest bookings from the admin dashboard."
  },
  {
    keywords: ["contact", "Hotline", "phone", "email", "help", "support"],
    answer: "For further assistance, please reach out to our front desk at support@ceylonheights.com or call +94 999998765."
  },
  {
    keywords: ["hi", "hello", "hey"],
    answer: "Hello! I'm here to help with bookings, payments, and general hotel questions. What would you like to know?"
  }
];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getAnswer(message) {
  const text = message.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of FAQ) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const escaped = escapeRegExp(keyword.toLowerCase());
      const pattern = new RegExp(`\\b${escaped}\\b`);
      if (pattern.test(text)) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch
    ? bestMatch.answer
    : "I'm not sure about that yet. Try asking about booking, payment, cancellation, check-in/out times, or room types — or contact the front desk for anything else.(+94 999998765.)";
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Welcome to Ceylon Heights Hotel. Ask me about bookings, payments, or room details." }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    const botMessage = { from: "bot", text: getAnswer(input) };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div className="chatbot-wrapper">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <span>Hotel Assistant</span>
            <button type="button" className="chatbot-close" onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.from}`}>
                {m.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form className="chatbot-input-row" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setOpen((prev) => !prev)}>
        {open ? "Close" : "Chat"}
      </button>
    </div>
  );
}

export default ChatBot;