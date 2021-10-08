const mongoose = require("mongoose");

const linksSchema = new mongoose.Schema({
  href: { type: String, required: [true, "dont forget the source"] },
  name: String,
  type: String,
  p1_type: String,
  p2_type: String,
});

const Links = mongoose.model("link", linksSchema);
module.exports = Links;
