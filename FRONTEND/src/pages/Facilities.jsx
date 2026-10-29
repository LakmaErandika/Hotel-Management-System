import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DEFAULT_FACILITIES = [
  { icon: "📶", title: "Free WiFi", desc: "High-speed internet access throughout the hotel and in every room." },
  { icon: "🌊", title: "Sea View", desc: "Select rooms offer direct views over Polhena Beach." },
  { icon: "🏊", title: "Swimming Pool", desc: "An outdoor pool open to all guests, with sun loungers nearby." },
  { icon: "🅿️", title: "Free Parking", desc: "On-site parking available at no extra charge." },
  { icon: "🍳", title: "Breakfast Included", desc: "A daily breakfast featuring local and continental options." },
  { icon: "🧺", title: "Laundry Service", desc: "Same-day laundry and ironing service on request." },
  { icon: "❄️", title: "Air Conditioning", desc: "Climate control available in all room types." },
  { icon: "🏖️", title: "Beach Access", desc: "Polhena Beach is a five-minute walk from the hotel." }
];

function Facilities() {
  const { user } = useAuth();
  const [items, setItems] = useState(DEFAULT_FACILITIES);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_FACILITIES);

  useEffect(() => {
    api.get("/content/facilities")
      .then((res) => {
        if (res.data?.items) {
          setItems(res.data.items);
          setDraft(res.data.items);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const updateDraftItem = (index, field, value) => {
    const copy = [...draft];
    copy[index] = { ...copy[index], [field]: value };
    setDraft(copy);
  };

  const addItem = () => {
    setDraft([...draft, { icon: "✨", title: "New Facility", desc: "Description" }]);
  };

  const removeItem = (index) => {
    setDraft(draft.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    api.put("/content/facilities", { items: draft })
      .then(() => {
        setItems(draft);
        setEditing(false);
      })
      .catch((err) => alert(err.response?.data?.error || "Error saving content"));
  };

  return (
    <div className="page">
      <h1>Hotel Facilities</h1>

      {user?.role === "admin" && !editing && (
        <button className="btn-secondary" onClick={() => setEditing(true)} style={{ marginBottom: "16px" }}>
          Edit Page
        </button>
      )}

      {editing ? (
        <div>
          {draft.map((f, i) => (
            <div key={i} className="facility-card" style={{ marginBottom: "12px" }}>
              <input type="text" value={f.icon} onChange={(e) => updateDraftItem(i, "icon", e.target.value)} style={{ width: "60px", marginBottom: "8px" }} placeholder="Icon" />
              <input type="text" value={f.title} onChange={(e) => updateDraftItem(i, "title", e.target.value)} style={{ width: "100%", marginBottom: "8px", padding: "8px" }} placeholder="Title" />
              <input type="text" value={f.desc} onChange={(e) => updateDraftItem(i, "desc", e.target.value)} style={{ width: "100%", marginBottom: "8px", padding: "8px" }} placeholder="Description" />
              <button className="btn-danger" onClick={() => removeItem(i)}>Remove</button>
            </div>
          ))}
          <button className="btn-secondary" onClick={addItem} style={{ marginBottom: "16px" }}>+ Add Facility</button>
          <br />
          <button onClick={handleSave}>Save</button>{" "}
          <button className="btn-secondary" onClick={() => { setDraft(items); setEditing(false); }}>Cancel</button>
        </div>
      ) : (
        <div className="facilities-grid">
          {items.map((f, i) => (
            <div className="facility-card" key={i}>
              <div className="facility-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Facilities;