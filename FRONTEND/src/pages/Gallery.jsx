import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
];

function Gallery() {
  const { user } = useAuth();
  const [images, setImages] = useState(DEFAULT_IMAGES);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_IMAGES);

  useEffect(() => {
    api.get("/content/gallery")
      .then((res) => {
        if (res.data?.images) {
          setImages(res.data.images);
          setDraft(res.data.images);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const updateUrl = (index, value) => {
    const copy = [...draft];
    copy[index] = value;
    setDraft(copy);
  };

  const addImage = () => setDraft([...draft, ""]);
  const removeImage = (index) => setDraft(draft.filter((_, i) => i !== index));

  const handleSave = () => {
    const cleaned = draft.filter((url) => url.trim() !== "");
    api.put("/content/gallery", { images: cleaned })
      .then(() => {
        setImages(cleaned);
        setEditing(false);
      })
      .catch((err) => alert(err.response?.data?.error || "Error saving content"));
  };
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
  if (lightboxIndex === null) return;
  const onKey = (e) => {
    if (e.key === "Escape") setLightboxIndex(null);
    if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % images.length);
    if (e.key === "ArrowLeft") setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  };
  window.addEventListener("keydown", onKey);
  document.body.style.overflow = "hidden";
  return () => {
    window.removeEventListener("keydown", onKey);
    document.body.style.overflow = "";
  };
}, [lightboxIndex, images.length]);

  return (
    <div className="page wide">
      <h1>Gallery</h1>
      <p className="gallery-intro">Rooms, bathrooms and the pool at Ceylon Heights Hotel. Select a photo to see it larger.</p>

      {user?.role === "admin" && !editing && (
        <button className="btn-secondary" onClick={() => setEditing(true)} style={{ marginBottom: "16px" }}>
          Edit Page
        </button>
      )}

      {editing ? (
        <div>
          {draft.map((url, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                type="text"
                value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder="Image URL"
                style={{ flex: 1 }}
              />
              <button className="btn-danger" onClick={() => removeImage(i)}>Remove</button>
            </div>
          ))}
          <button className="btn-secondary" onClick={addImage} style={{ marginBottom: "16px" }}>+ Add Image</button>
          <br />
          <button onClick={handleSave}>Save</button>{" "}
          <button className="btn-secondary" onClick={() => { setDraft(images); setEditing(false); }}>Cancel</button>
        </div>
      ) : (
        <div className="gallery-masonry">
  {images.map((src, i) => (
    <button
      type="button"
      className="gallery-item"
      key={i}
      onClick={() => setLightboxIndex(i)}
      aria-label={`Open photo ${i + 1} of ${images.length}`}
    >
      <img src={src} alt={`Hotel photo ${i + 1}`} className="gallery-photo" loading="lazy" />
    </button>
  ))}
</div>
      )}

      {lightboxIndex !== null && (
  <div
    className="lightbox"
    role="dialog"
    aria-modal="true"
    aria-label="Photo viewer"
    onClick={() => setLightboxIndex(null)}
  >
    <button type="button" className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close viewer">×</button>
    <button
      type="button"
      className="lightbox-nav prev"
      onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length); }}
      aria-label="Previous photo"
    >‹</button>
    <img
      src={images[lightboxIndex]}
      alt={`Hotel photo ${lightboxIndex + 1}`}
      onClick={(e) => e.stopPropagation()}
    />
    <button
      type="button"
      className="lightbox-nav next"
      onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length); }}
      aria-label="Next photo"
    >›</button>
    <p className="lightbox-count">{lightboxIndex + 1} of {images.length}</p>
  </div>
)}

    </div>
  );
}

export default Gallery;