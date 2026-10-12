// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddRoom from "./pages/AddRoom";
import UpdateRoom from "./pages/UpdateRoom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-room" element={<AddRoom />} />
        <Route path="/update-room/:id" element={<UpdateRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;