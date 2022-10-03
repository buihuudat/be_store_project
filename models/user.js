const mongoose = require("mongoose");

const User = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  password: String,
  fullname: String,
  image: String,
});

module.exports = mongoose.model("User", User);
