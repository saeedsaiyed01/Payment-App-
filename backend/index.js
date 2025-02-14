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

// // CORS Configuration
// const allowedOrigins = [
//     'http://localhost:5173',
//     'http://localhost:5174',
//     'https://frontend-v2-qk07wj39y-saeeds-projects-59535290.vercel.app',
//     'https://payment-app-rzd7.vercel.app'
// ];

// // Debugging log for incoming requests
// const corsOptions = {
//     origin: function (origin, callback) {
//         console.log("🔍 Request Origin:", origin); // Debug log

//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             console.error("❌ Blocked by CORS:", origin);
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
