const mongoose = require("mongoose");

// Define the schema for user data in MongoDB.
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"], // Ensure email is provided.
    unique: true, // Prevent duplicate emails in the database.
    trim: true, // Remove whitespace from both ends.
    lowercase: true, // Convert email to lowercase to standardize and avoid case-sensitive issues.
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    // Note: Hash passwords before storing using a pre-save hook or similar.
  },
});

// Compile the schema into a model to interface with the MongoDB collection.
module.exports = mongoose.model("User", userSchema);
