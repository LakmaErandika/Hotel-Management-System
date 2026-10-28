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
    <nav className="navbar">
      <span className="brand">Ceylon Heights Hotel</span>
      <Link to="/">Rooms</Link>

      {user && user.role === "admin" && (
        <>
          <Link to="/add-room">Add Room</Link>
          <Link to="/admin/bookings">Manage Bookings</Link>
        </>
      )}

      {user && user.role === "guest" && (
        <Link to="/my-bookings">My Bookings</Link>
      )}

      {!user && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {user && (
        <>
          <span className="user-tag">{user.name} · {user.role}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;