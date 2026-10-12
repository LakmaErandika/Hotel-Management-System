import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <Link to="/" style={{ color: "#fff", marginRight: "15px" }}>Rooms</Link>
      <Link to="/add-room" style={{ color: "#fff" }}>Add Room</Link>
    </nav>
  );
}

export default Navbar;