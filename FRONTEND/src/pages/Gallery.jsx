const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
];

function Gallery() {
  return (
    <div className="page">
      <h1>Gallery</h1>
      <div className="gallery-grid">
        {GALLERY_IMAGES.map((src, i) => (
          <img src={src} alt={`Hotel view ${i + 1}`} key={i} className="gallery-img" />
        ))}
      </div>
    </div>
  );
}

export default Gallery;