const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  token: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expiryDate: Date,
});

// Compile the schema into a moddel to interface with the MongoDB collection.
module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
