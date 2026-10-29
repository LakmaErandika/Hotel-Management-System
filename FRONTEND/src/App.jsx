import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AddRoom from "./pages/AddRoom";
import UpdateRoom from "./pages/UpdateRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookRoom from "./pages/BookRoom";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";
import About from "./pages/About";
import Facilities from "./pages/Facilities";
import Gallery from "./pages/Gallery";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import RoomDetails from "./pages/RoomDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/room/:id" element={<RoomDetails />} />

          <Route path="/add-room" element={
            <ProtectedRoute adminOnly><AddRoom /></ProtectedRoute>
          } />
          <Route path="/update-room/:id" element={
            <ProtectedRoute adminOnly><UpdateRoom /></ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>
          } />

          <Route path="/book/:id" element={
            <ProtectedRoute><BookRoom /></ProtectedRoute>
          } />
          <Route path="/payment/:bookingId" element={
            <ProtectedRoute><Payment /></ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute><MyBookings /></ProtectedRoute>
          } />
        </Routes>
        <Footer />
        <ChatBot />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;