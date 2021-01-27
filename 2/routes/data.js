const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
    id: Number,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    registrationKey: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);
