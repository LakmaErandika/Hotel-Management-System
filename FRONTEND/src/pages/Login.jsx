import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    api.post("/auth/login", { email, password })
      .then((res) => {
        login(res.data.user, res.data.token);
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Login failed");
      });
  };

  return (
  <div className="form-panel">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="form-error">{error}</p>}
      <button type="submit">Login</button>
    </form>
    <p className="form-footer">Don't have an account? <Link to="/register">Register</Link></p>
  </div>
 );
}

export default Login;