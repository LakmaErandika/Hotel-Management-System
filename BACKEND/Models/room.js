// models/Room.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;