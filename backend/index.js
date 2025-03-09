// Load environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const svgCaptcha = require('svg-captcha');
const rootRouter = require('./ROUTES/index');

// Initialize the Express app
const app = express();

// CORS Configuration - place this at the top
const allowedOrigins = [
    'http://localhost:5173',
    'https://payment-app--nine.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        console.log("🔍 Request Origin:", origin);
        // Allow requests with no origin (like Postman) or if origin is in our list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error("❌ Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"), false);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing (optional, now also covered by CORS)
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

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
