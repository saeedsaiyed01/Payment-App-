// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require("../db");
const { User } = require("../db");
const {Transaction} = require("../db")

const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

router.post("/transaction", authMiddleware, async (req, res) => {
    try {
        const { userId, type, name, date, amount, category, status } = req.body;

        // Validate the incoming data (if necessary)
        if (!userId || !type || !name || !date || !amount || !category || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const transaction = new Transaction({
            userId,  // Reference to the user
            type,
            name,
            date,
            amount,
            category,
            status
        }); 
        
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        console.error("Error saving transaction:", error);
        res.status(400).json({ message: error.message });
    }
});

router.get("/transaction", authMiddleware, async (req, res) => {
    try {
        // Fetch only transactions of the logged-in user
        const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const { amount, to, pin } = req.body;

  try {
      // Fetch sender's account
      const senderAccount = await Account.findOne({ userId: req.userId });
      if (!senderAccount || senderAccount.balance < amount) {
          return res.status(400).json({ message: "Insufficient balance" });
      }

      // Fetch recipient's account
      const recipientAccount = await Account.findOne({ userId: to });
      if (!recipientAccount) {
          return res.status(400).json({ message: "Invalid recipient account" });
      }

      // Fetch sender and validate PIN
      const sender = await User.findOne({ _id: req.userId });
      if (!sender || sender.pin !== pin) {
          return res.status(400).json({ message: "Invalid PIN" });
      }

      // Fetch recipient's details
      const recipient = await User.findOne({ _id: to });
      if (!recipient) {
          return res.status(400).json({ message: "Recipient not found" });
      }

      // Perform the transfer
      await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } });
      await Account.updateOne({ userId: to }, { $inc: { balance: amount } });

      // Add transaction record for sender (debit)
      const senderTransaction = new Transaction({
          userId: req.userId,
          type: "debit",
          name: `Transfer to ${recipient.firstName}`,
          date: new Date(),
          amount,
          category: "Transfer",
          status: "completed"
      });

      // Add transaction record for recipient (credit)
      const recipientTransaction = new Transaction({
          userId: to,
          type: "credit",
          name: `Received a from ${sender.firstName}`,
          date: new Date(),
          amount,
          category: "Transfer",
          status: "completed"
      });

      // Save both transactions
      await senderTransaction.save();
      await recipientTransaction.save();

      res.json({ message: "Transfer successful and transactions recorded" });

  } catch (error) {
      console.error('Transaction error:', error);
      res.status(500).json({ message: "An error occurred during the transfer" });
  }
});


module.exports = router;