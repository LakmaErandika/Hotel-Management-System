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
  },
  description: {
    type: String,
    default: ""
  },
  facilities: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String,
    default: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
  }
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;