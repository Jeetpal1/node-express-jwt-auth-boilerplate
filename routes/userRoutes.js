const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");

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
 * Route to authenticate a user and provide JWT and refresh tokens.
 * - Validates user credentials.
 * - Issues a JWT for valid credentials.
 * - Generates a refresh token for renewing the JWT.
 */
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Attempt to find the user by their email.
    const user = await User.findOne({ email });
    if (!user) {
      // Respond with an error if the user doesn't exist.
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Verify the password against the hashed password in the database.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If the password doesn't match, respond with an error.
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // User credentials are valid, proceed to generate the JWT.
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Generate a separate refresh token that doesn't expire quickly.
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    // Save the refresh token with an expiry date in the database
    const newRefreshToken = new RefreshToken({
      token: refreshToken,
      user: user._id,
      // Set refresh token to expire in 14 days or any suitable timeframe
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    await newRefreshToken.save();

    // Respond with both access and refresh tokens.
    res.json({
      message: "User logged in successfully.",
      token, // Access token for API authentication.
      refreshToken, // Refresh token to obtain new access tokens after expiry.
    });
  } catch (error) {
    // Log the error and respond with a server error status code.
    console.error(error);
    res.status(500).json({ message: "Error signing in user." });
  }
});

/**
 * Route for refreshing the JWT token. This involves:
 * - Checking if the refresh token is provided.
 * - Verifying the refresh token.
 * - If the refresh token is valid, creating and returning a new access token.
 */
router.post("/token", async (req, res) => {
  const { token: refreshToken } = req.body;

  // Find the refresh token in the database
  const storedRefreshToken = await RefreshToken.findOne({
    token: refreshToken,
  });
  if (!storedRefreshToken || storedRefreshToken.expiryDate <= new Date()) {
    return res.status(401).send("Invalid or expired refresh token");
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send("Refresh token verification failed");
    }

    // If the refresh token is valid, create a new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  });
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
