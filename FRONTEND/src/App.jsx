
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import AddRoom from "./pages/AddRoom";
import UpdateRoom from "./pages/UpdateRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-room" element={<AddRoom />} />
          <Route path="/update-room/:id" element={<UpdateRoom />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;