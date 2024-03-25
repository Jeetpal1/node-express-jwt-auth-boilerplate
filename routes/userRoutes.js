const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();

/**
 * Middleware to validate the JWT token in the authorization header.
 * This ensures that only authenticated users can access certain routes.
 */
const authenticateToken = (req, res, next) => {
  // Retrieve the token from the Authorization header.
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  // Deny access if the token is missing.
  if (!token)
    return res.status(401).send("Authorization failed. No access token.");

  // Verify the token's validity and proceed if valid, else return an error.
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user; // Attach the user payload to the request object.
    next(); // Proceed to the next middleware/route handler.
  });
};

/**
 * Route to register a new user. This involves:
 * - Checking if the email is already in use.
 * - Hashing the password for secure storage.
 * - Creating and storing the new user in the database.
 */
router.post("/sign-up", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure uniqueness of the email to avoid duplicate accounts.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Securely hash the password before storing it in the database.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance and save it to the database.
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save(); // Save the new user to the database.
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user." });
  }
});

/**
 * Route to authenticate a user. This involves:
 * - Verifying the user's credentials.
 * - Generating a JWT token for the session if credentials are valid.
 */
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for the existence of the user by email.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the stored hash.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token as part of the successful login response.
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "User logged in successfully.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing in user." });
  }
});

/**
 * An example of a protected route that requires token authentication.
 * Accessible only to requests with a valid JWT token.
 */
router.get("/protected", authenticateToken, (req, res) => {
  // Send a response that includes user information from the JWT payload.
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
