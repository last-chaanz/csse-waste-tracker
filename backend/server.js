const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 4000;
const DB_URI = process.env.MONGO_URI;

// Validate critical environment variables
if (!DB_URI) {
  console.error(
    "Error: Mongo URI is not defined. Please set MONGO_URI in your environment variables."
  );
  process.exit(1);
}

// Middleware
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies

// Routes
const authRoutes = require("./routes/auth");
const binRoute = require("./routes/binRoute");


app.use("/api/auth", authRoutes);
app.use("/api", binRoute);

// Connect to the Database
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔌 Connected to the Database");
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Something went wrong!" });
});

// Graceful shutdown
const shutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error closing database connection :", err.message);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on Port ${PORT}`);
  });
};

startServer();

module.exports = app;
