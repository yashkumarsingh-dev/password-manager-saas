// Try to load .env file
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const vaultRoutes = require("./routes/vault");
const errorHandler = require("./middleware/errorHandler");
const utilsRoutes = require("./routes/utils");
const paymentRoutes = require("./routes/payment");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
  res.send("Password Manager API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/utils", utilsRoutes);
app.use("/api/payment", paymentRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log(
      "Make sure MongoDB is running locally or update MONGO_URI in .env file"
    );
    process.exit(1);
  });
