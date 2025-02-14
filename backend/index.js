// Load environment variables
require('dotenv').config();
const svgCaptcha = require('svg-captcha');

// Import dependencies
const express = require('express');
const cors = require('cors');
const rootRouter = require('./ROUTES/index');

// Initialize the Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Backend is working!");
  });
  
// CORS configuration
const allowedOrigins = [
    'http://localhost:5173','http://localhost:5174',
    " https://frontend-v2-qk07wj39y-saeeds-projects-59535290.vercel.app",
     // / // Your frontend local origin
    // Add more origins as needed
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Port configuration
const PORT = process.env.PORT || 3000;

// Mount the main router
app.use('/api/v1', rootRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).send('Something went wrong!'); // Generic error message
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
