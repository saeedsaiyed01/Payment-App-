// Load environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const svgCaptcha = require('svg-captcha');
const rootRouter = require('./ROUTES/index');

// Initialize the Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// CORS Configuration
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  

// Mount the main router
app.use('/api/v1', rootRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("⚠️ Error:", err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Port configuration
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
