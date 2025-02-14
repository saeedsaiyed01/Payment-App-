  // backend/db.js
  //mongodb+srv://paytm:vijayshekhar@cluster0.zwxq1c5.mongodb.net/new
  require('dotenv').config();

  const mongoose = require('mongoose');

  mongoose.connect(process.env.MONGO_URL, {
    
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
  });
  // Create a Schema for Users
  const userSchema = new mongoose.Schema({
      username: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          lowercase: true,
          minLength: 3,
          maxLength: 30
      },
      password: {
          type: String,
          required: true,
          minLength: 6
      },pin: {
          type: String,
          required: true,
          maxLength: 4,
          validate: {
              validator: function(value) {
                  return /^\d{4}$/.test(value);
              },
              message: 'PIN must be exactly 4 digits'
          }
      },
      
      firstName: {
          type: String,
          required: true,
          trim: true,
          maxLength: 50
      },
      lastName: {
          type: String,
          required: true,
          trim: true,
          maxLength: 50
      }
  });

  const accountSchema = new mongoose.Schema({
      userId: {
          type: mongoose.Schema.Types.ObjectId, // Reference to User model
          ref: 'User',
          required: true
      },
      balance: {
          type: Number,
          required: true
      }
  });


  // const transactionSchema = new mongoose.Schema({
  //   // Reference to the User who performed the transaction
  //   userId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: true
  //   },
  //   // Reference to the Account involved in the transaction
  //   accountId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Account',
  //     required: true
  //   },
  //   // Transaction type: 'credit' for incoming funds, 'debit' for outgoing funds
  //   type: {
  //     type: String,
  //     enum: ['credit', 'debit'],
  //     required: true
  //   },
  //   // A descriptive name for the transaction (e.g., "Salary Deposit", "Sent to Jane Smith")
  //   name: {
  //     type: String,
  //     required: true,
  //     trim: true
  //   },
  //   // Date of the transaction; default is the current date and time
  //   date: {
  //     type: Date,
  //     required: true,
  //     default: Date.now
  //   },
  //   // The monetary amount of the transaction
  //   amount: {
  //     type: Number,
  //     required: true,
  //     min: 0
  //   },
  //   // Category of the transaction (e.g., "Transfer", "Income", "Expense")
  //   category: {
  //     type: String,
  //     required: true,
  //     trim: true
  //   },
  //   // Status of the transaction: 'completed', 'pending', or 'failed'
  //   status: {
  //     type: String,
  //     enum: ['completed', 'pending', 'failed'],
  //     required: true
  //   }
  // });

  // Create the model from the schema

  const transactionSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model
      required: true
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      required: true
    }
  });

  const Transaction = mongoose.model('Transaction', transactionSchema);
  const Account = mongoose.model('Account', accountSchema);
  const User = mongoose.model('User', userSchema);

  module.exports = {
    User,
      Account,
      Transaction,
  };