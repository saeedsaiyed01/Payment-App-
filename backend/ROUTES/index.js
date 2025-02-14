const express = require('express');
const captchaRouter = require('./captcha');
const userRouter = require('./user');
const accountRouter = require('./account');
const router = express.Router();





// Routes
router.use("/captcha", captchaRouter);
router.use("/user", userRouter);
router.use("/account",accountRouter)

module.exports = router;