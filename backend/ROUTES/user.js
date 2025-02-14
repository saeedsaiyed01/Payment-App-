require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");

// Add Balance Route
router.post('/addBalance', authMiddleware, async (req, res) => {
    try {
        let { amount, pin } = req.body;

        // Ensure amount is properly parsed as a number
        amount = parseFloat(amount);
        console.log('Amount to Add:', amount);

        if (isNaN(amount) || amount <= 0) {
            console.log('Invalid amount:', amount);
            return res.status(400).json({ error: 'Invalid amount' });
        }

        if (!pin || pin.length !== 4) {
            console.log('Invalid PIN format:', pin);
            return res.status(400).json({ error: 'Invalid PIN format' });
        }

        console.log('req.userId:', req.userId);

        const user = await User.findById(req.userId);
        if (!user) {
            console.log('User not found for ID:', req.userId);
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.pin !== pin) {
            console.log('Incorrect PIN for user:', req.userId);
            return res.status(401).json({ error: 'Incorrect PIN' });
        }

        const account = await Account.findOne({ userId: req.userId });
        if (!account) {
            console.log('Account not found for userId:', req.userId);
            return res.status(404).json({ error: 'Account not found' });
        }

        console.log('Old Balance:', account.balance);

        // Ensure old balance is a valid number
        let oldBalance = parseFloat(account.balance);
        if (isNaN(oldBalance)) {
            console.log('Invalid account balance:', account.balance);
            return res.status(500).json({ error: 'Invalid account balance' });
        }

        // Calculate the new balance
        let newBalance = oldBalance + amount;
        account.balance = newBalance; // Store newBalance directly

        await account.save();
        console.log('New Balance:', newBalance);

        // Respond with the old and new balance
        res.status(200).json({ oldBalance: oldBalance, newBalance: newBalance });
    } catch (error) {
        console.error('Error adding balance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Signup Route
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
    pin: zod.string().regex(/^\d{4}$/, { message: "PIN must be exactly 4 digits" })
});

router.post("/signup", async (req, res) => {
    // Validate the request body
    const { success, error } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Incorrect inputs",
            error: error.errors
        });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(409).json({ message: "Email already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 13);

    // Create a new user
    const user = await User.create({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        pin: req.body.pin // No hashing for the PIN
    });

    // Create an associated account
    const userId = user._id;
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    // Generate a JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    // Send the response
    res.status(201).json({
        message: "User created successfully",
        token: token
    });
});
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    captcha: zod.string(),  // Still include captcha in validation
});

router.post('/signin', async (req, res) => {
    // Validate request data
    const parsed = signinBody.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid input",
            error: parsed.error.errors
        });
    }

    const { username, password, captcha } = req.body;

    // Debug logs
    console.log('Request body:', req.body);
    console.log('Received CAPTCHA:', captcha);

    // Check if the CAPTCHA is valid (now stored in localStorage on the frontend)
    const storedCaptcha = req.body.captchaStored;  // Assuming you pass this from localStorage
    console.log('Stored CAPTCHA:', storedCaptcha);

    if (captcha !== storedCaptcha) {
        return res.status(400).json({ message: 'Invalid CAPTCHA' });
    }

    // Check for valid username and password
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // If authentication is successful
    return res.status(200).json({ message: 'Sign-in successful', token });
});






// Get User Information Route
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId); // Find the user by ID from the token
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            // Add other fields as necessary
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update User Information Route
router.put("/", authMiddleware, async (req, res) => {
    const { success, error } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid input",
            error: error.errors
        });
    }

    try {
        const result = await User.updateOne({ _id: req.userId }, req.body);
        if (result.nModified === 0) {
            return res.status(404).json({ message: "User not found or data unchanged" });
        }

        res.json({ message: "Updated successfully" });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search Users in Bulk
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    try {
        const users = await User.find({
            $or: [
                { firstName: { "$regex": filter, "$options": "i" } },
                { lastName: { "$regex": filter, "$options": "i" } }
            ]
        });

        res.json({
            users: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update user details
router.put("/update-user/:id", async (req, res) => {
    try {
        const { username, firstName, lastName } = req.body;
        const userId = req.params.id;

        // Find and update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, firstName, lastName },
            { new: true, runValidators: true } // Returns updated user and runs schema validation
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

module.exports = router;