const FACILITIES = [
  { icon: "📶", title: "Free WiFi", desc: "High-speed internet access throughout the hotel and in every room." },
  { icon: "🌊", title: "Sea View", desc: "Select rooms offer direct views over Polhena Beach." },
  { icon: "🏊", title: "Swimming Pool", desc: "An outdoor pool open to all guests, with sun loungers nearby." },
  { icon: "🅿️", title: "Free Parking", desc: "On-site parking available at no extra charge." },
  { icon: "🍳", title: "Breakfast Included or Not", desc: "A daily breakfast featuring local and continental options." },
  { icon: "🧺", title: "Laundry Service", desc: "Same-day laundry and ironing service on request." },
  { icon: "❄️", title: "Air Conditioning", desc: "Climate control available in all room types." },
  { icon: "🏖️", title: "Beach Access", desc: "Polhena Beach is a five-minute walk from the hotel." }
];

function Facilities() {
  return (
    <div className="page">
      <h1>Hotel Facilities</h1>
      <div className="facilities-grid">
        {FACILITIES.map((f, i) => (
          <div className="facility-card" key={i}>
            <div className="facility-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Facilities;