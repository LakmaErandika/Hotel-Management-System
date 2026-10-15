
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <Link to="/" style={{ color: "#fff", marginRight: "15px" }}>Rooms</Link>

      {user && user.role === "admin" && (
        <Link to="/add-room" style={{ color: "#fff", marginRight: "15px" }}>Add Room</Link>
      )}

      {!user && (
        <>
          <Link to="/login" style={{ color: "#fff", marginRight: "15px" }}>Login</Link>
          <Link to="/register" style={{ color: "#fff" }}>Register</Link>
        </>
      )}

      {user && (
        <>
          <span style={{ marginRight: "15px" }}>Hi, {user.name} ({user.role})</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;