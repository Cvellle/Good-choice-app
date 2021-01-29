const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdvicesSchema = new Schema(
  {
    id: Number,
    creator: String,
    name: String,
    location: String,
    category: String,
    likes: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advices", AdvicesSchema);
