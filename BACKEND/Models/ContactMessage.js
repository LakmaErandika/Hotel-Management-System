const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactMessageSchema = new Schema({
  guest: { type: Schema.Types.ObjectId, ref: "User", default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  reply: { type: String, default: "" },
  repliedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("ContactMessage", contactMessageSchema);