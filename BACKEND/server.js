const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8870;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const URL = process.env.MONGODB_URL;

mongoose.connect(URL)
  .then(() => console.log("MongoDB connection success!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic test route
app.get("/", (req, res) => {
  res.send("Hotel Management System API is running");
});

   const roomRouter = require("./Routes/Rooms.js");
   app.use("/room", roomRouter);

app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});