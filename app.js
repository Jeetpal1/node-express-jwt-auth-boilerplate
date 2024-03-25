require("dotenv").config(); // Load environment variables.
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/userRoutes");

const app = express();

// Body parser middleware to handle request bodies.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Establish MongoDB connection.
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, // Using the new URL parser for MongoDB connection strings
    useUnifiedTopology: true, // Opting in to use MongoDB driver's new connection management engine
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Authentication routes.
app.use(authRoutes);

// Start the server on the specified port.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
