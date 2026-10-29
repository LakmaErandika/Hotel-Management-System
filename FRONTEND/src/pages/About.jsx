import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DEFAULT_TEXT = `Ceylon Heights Hotel sits on Sri Lanka's southern coast in Matara, just a short walk from Polhena Beach — known for its calm, reef-sheltered waters and clear views for swimming and snorkelling.

We offer a range of rooms from comfortable singles to spacious deluxe suites, each designed for a relaxed coastal stay. Our location puts you close to Matara's Dutch colonial fort, local seafood restaurants, and the everyday rhythm of a southern Sri Lankan town.

Whether you're here for a weekend by the sea or a longer stay to explore the south, our team is here to make your visit comfortable from check-in to check-out.`;

function About() {
  const { user } = useAuth();
  const [text, setText] = useState(DEFAULT_TEXT);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_TEXT);

  useEffect(() => {
    api.get("/content/about")
      .then((res) => {
        if (res.data?.text) {
          setText(res.data.text);
          setDraft(res.data.text);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSave = () => {
    api.put("/content/about", { text: draft })
      .then(() => {
        setText(draft);
        setEditing(false);
      })
      .catch((err) => alert(err.response?.data?.error || "Error saving content"));
  };

  return (
    <div className="page">
      <h1>About Ceylon Heights Hotel</h1>

      {user?.role === "admin" && !editing && (
        <button className="btn-secondary" onClick={() => setEditing(true)} style={{ marginBottom: "16px" }}>
          Edit Page
        </button>
      )}

      {editing ? (
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            style={{ width: "100%", padding: "14px", border: "1px solid var(--border)", background: "var(--ivory-dim)", fontFamily: "inherit", marginBottom: "12px" }}
          />
          <button onClick={handleSave}>Save</button>{" "}
          <button className="btn-secondary" onClick={() => { setDraft(text); setEditing(false); }}>Cancel</button>
        </div>
      ) : (
        text.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
      )}
    </div>
  );
}

export default About;