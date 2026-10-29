const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const siteContentSchema = new Schema({
  key: { type: String, required: true, unique: true }, // "about" | "facilities" | "gallery" | "contactInfo"
  data: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model("SiteContent", siteContentSchema);