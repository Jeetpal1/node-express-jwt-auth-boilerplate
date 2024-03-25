const mongoose = require("mongoose");

// Define the schema for the reset token
const resetTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
});

// Create the ResetToken model using the schema
const ResetToken = mongoose.model("ResetToken", resetTokenSchema);

module.exports = ResetToken;
