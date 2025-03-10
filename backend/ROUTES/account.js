// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require("../db");
const { User } = require("../db");
const {Transaction} = require("../db")
const axios = require("axios")
const PDFDocument = require("pdfkit");
const ExcelJS = require('exceljs');
require("pdfkit-table"); // Adds the .table() method

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


router.get('/transaction/download', authMiddleware, async (req, res) => {
    try {
      // 1. Parse Query Parameters
      const { startDate, endDate, format } = req.query;
  
      // Validate "format" parameter
      if (
        !format ||
        (format.toLowerCase() !== 'excel' && format.toLowerCase() !== 'pdf')
      ) {
        return res
          .status(400)
          .json({ message: "Invalid format. Please select either 'excel' or 'pdf'." });
      }
  
      // 2. Convert date strings to Date objects and include entire endDate day
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
  
      // 3. Fetch the User (for PDF header, e.g., user name)
      const user = await User.findById(req.userId);
  
      // 4. GET current balance by calling the /balance route
      //    Pass the same Authorization header to satisfy authMiddleware
      const balanceRes = await axios.get(
        'https://payment-app-red-ten.vercel.app/api/v1/account/balance',
        {
          headers: {
            Authorization: req.headers.authorization,
          },  
        }
      );
      // Safely parse the balance in case it's not a perfect number
      const currentBalance = parseFloat(balanceRes.data.balance) || 0;
  
      // 5. Fetch Transactions within [start, end] sorted ascending by date
      const transactions = await Transaction.find({
        userId: req.userId,
        date: { $gte: start, $lte: end },
      }).sort({ date: 1 });
  
      // 6. Build Table Rows & Compute Totals (no running balance)
      let totalIncome = 0;
      let totalSpent = 0;
  
      const tableRows = transactions.map((txn) => {
        // Safely parse the amount to avoid .toFixed on undefined
        const numericAmount = parseFloat(txn.amount) || 0;
  
        let creditVal = '';
        let debitVal = '';
  
        if (txn.type === 'credit') {
          totalIncome += numericAmount;
          creditVal = numericAmount.toFixed(2);
        } else {
          totalSpent += numericAmount;
          debitVal = numericAmount.toFixed(2);
        }
  
        return {
          date: new Date(txn.date).toLocaleDateString(),
          description: txn.name, // Use "name" as description
          credit: creditVal,
          debit: debitVal,
        };
      });
  
      // 7. Format-based Output
      if (format.toLowerCase() === 'excel') {
        // ==== ExcelJS Implementation ====
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transaction Statement');
  
        // Define columns: Date, Description, Credit, Debit (no Balance column)
        worksheet.columns = [
          { header: 'Date', key: 'date', width: 15 },
          { header: 'Description', key: 'description', width: 25 },
          { header: 'Credit', key: 'credit', width: 10 },
          { header: 'Debit', key: 'debit', width: 10 },
        ];
  
        // Add rows to the worksheet
        tableRows.forEach((row) => worksheet.addRow(row));
  
        // Optional: Blank line, then final summary rows
        worksheet.addRow([]);
        worksheet.addRow(['', '', 'Total Income:', totalIncome.toFixed(2)]);
        worksheet.addRow(['', '', 'Total Spent:', totalSpent.toFixed(2)]);
        worksheet.addRow([
          '',
          '',
          'Current Available Balance:',
          currentBalance.toFixed(2),
        ]);
  
        // Set response headers for Excel download
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=Transaction_Statement.xlsx'
        );
  
        // Write workbook to response and end
        await workbook.xlsx.write(res);
        res.end();
      } else {
        // ==== PDFKit Implementation ====
        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const filename = `Transaction_Statement_${Date.now()}.pdf`;
  
        // Set response headers for PDF download
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/pdf');
  
        doc.pipe(res);
  
        // (a) Title & User Info
        doc
          .fontSize(18)
          .text('PayCheck - Transaction Statement', { align: 'center' });
        doc.moveDown(0.3);
  
        if (user) {
          doc
            .fontSize(12)
            .text(`User: ${user.firstName} ${user.lastName}`, {
              align: 'center',
            });
          doc.moveDown(0.3);
        }
  
        // Statement Period
        doc
          .fontSize(12)
          .text(
            `Statement Period: ${start.toDateString()} - ${end.toDateString()}`,
            { align: 'center' }
          )
          .moveDown(1);
  
        // (b) Summary: Total Income, Total Spent, and Current Available Balance
        doc
          .fontSize(12)
          .text(`Total Income (Credit): ${totalIncome.toFixed(2)}`)
          .text(`Total Spent (Debit): ${totalSpent.toFixed(2)}`)
          .text(`Current Available Balance: ${currentBalance.toFixed(2)}`)
          .moveDown(1);
  
        // (c) Table Header: Date | Description | Credit | Debit (no Balance column)
        const startX = 50;
        let startY = doc.y;
        const columnWidths = [80, 150, 60, 60];
  
        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('Date', startX, startY, { width: columnWidths[0] });
        doc.text('Description', startX + columnWidths[0], startY, {
          width: columnWidths[1],
        });
        doc.text('Credit', startX + columnWidths[0] + columnWidths[1], startY, {
          width: columnWidths[2],
          align: 'right',
        });
        doc.text(
          'Debit',
          startX + columnWidths[0] + columnWidths[1] + columnWidths[2],
          startY,
          { width: columnWidths[3], align: 'right' }
        );
  
        doc.moveTo(startX, startY + 15).lineTo(500, startY + 15).stroke();
  
        // (d) Table Rows
        doc.font('Helvetica').fontSize(10);
        let y = startY + 20;
        const rowHeight = 20;
  
        tableRows.forEach((row) => {
          if (y + rowHeight > doc.page.height - 50) {
            doc.addPage();
            y = 50;
          }
          doc.text(row.date, startX, y, { width: columnWidths[0] });
          doc.text(row.description, startX + columnWidths[0], y, {
            width: columnWidths[1],
          });
          doc.text(row.credit, startX + columnWidths[0] + columnWidths[1], y, {
            width: columnWidths[2],
            align: 'right',
          });
          doc.text(
            row.debit,
            startX + columnWidths[0] + columnWidths[1] + columnWidths[2],
            y,
            { width: columnWidths[3], align: 'right' }
          );
          y += rowHeight;
        });
  
        // (e) End of Transactions + Final Summary
        doc.moveDown(1).font('Helvetica-Bold').fontSize(10);
        doc.text('--- End of Transactions ---', { align: 'center' });
        doc.moveDown(1);
  
        doc.fontSize(12);
        doc.text(`Total Income (Credit): ${totalIncome.toFixed(2)}`, {
          align: 'right',
        });
        doc.text(`Total Spent (Debit): ${totalSpent.toFixed(2)}`, {
          align: 'right',
        });
        doc.text(`Current Available Balance: ${currentBalance.toFixed(2)}`, {
          align: 'right',
        });
  
        // (f) Page Footers (Page X of Y) 
        const pageRange = doc.bufferedPageRange();
        for (let i = pageRange.start; i < pageRange.start + pageRange.count; i++) {
          doc.switchToPage(i);
          doc.fontSize(8).text(`Page ${i + 1} of ${pageRange.count}`, 50, doc.page.height - 50, {
            align: 'center',
            width: doc.page.width - 100,
          });
        }
  
        doc.end();
      }
    } catch (error) {
      console.error('Error generating statement:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
//-------------//
// router.get('/transaction/download', authMiddleware, async (req, res) => {
//   try {
//     // 1. Parse Query Parameters
//     const { startDate, endDate, format } = req.query;
//     if (
//       !format ||
//       (format.toLowerCase() !== 'excel' && format.toLowerCase() !== 'pdf')
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Invalid format. Please select either 'excel' or 'pdf'." });
//     }

//     // 2. Convert date strings to Date objects and include entire endDate day
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     end.setHours(23, 59, 59, 999);

//     // Alternative Fix: Include transactions strictly within range
// const nextDay = new Date(end);
// nextDay.setDate(nextDay.getDate() + 1);
// nextDay.setHours(0, 0, 0, 0);  // Start of next day

//     // 3. Fetch the User (for header info and for user's PIN)
//     const user = await User.findById(req.userId);
//     const userPin = user.pin; // This is the user's actual PIN from signup

//     // 4. GET current balance by calling the /balance route
//     const balanceRes = await axios.get(
//      'https://payment-app-red-ten.vercel.app/api/v1/account/balance',
//       { headers: { Authorization: req.headers.authorization } }
//     );
//     const currentBalance = parseFloat(balanceRes.data.balance) || 0;

//     // 5. Fetch Transactions within [start, end] sorted ascending by date
//     const transactions = await Transaction.find({
//       userId: req.userId,
//       date: { $gte: start, $lte: nextDay },
//     }).sort({ date: 1 });

//     // 6. Build Table Rows & Compute Totals (no running balance)
//     let totalIncome = 0;
//     let totalSpent = 0;
//     const tableRows = transactions.map((txn) => {
//       const numericAmount = parseFloat(txn.amount) || 0;
//       let creditVal = '';
//       let debitVal = '';

//       if (txn.type === 'credit') {
//         totalIncome += numericAmount;
//         creditVal = numericAmount.toFixed(2);
//       } else {
//         totalSpent += numericAmount;
//         debitVal = numericAmount.toFixed(2);
//       }

//       return {
//         date: new Date(txn.date).toLocaleDateString(),
//         description: txn.name,
//         credit: creditVal,
//         debit: debitVal,
//       };
//     });

//     if (format.toLowerCase() === 'excel') {
//       // ===== EXCELJS Implementation (unchanged) =====
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Transaction Statement');

//       worksheet.columns = [
//         { header: 'Date', key: 'date', width: 15 },
//         { header: 'Description', key: 'description', width: 25 },
//         { header: 'Credit', key: 'credit', width: 10 },
//         { header: 'Debit', key: 'debit', width: 10 },
//       ];

//       tableRows.forEach((row) => worksheet.addRow(row));

//       worksheet.addRow([]);
//       worksheet.addRow(['', '', 'Total Income:', totalIncome.toFixed(2)]);
//       worksheet.addRow(['', '', 'Total Spent:', totalSpent.toFixed(2)]);
//       worksheet.addRow(['', '', 'Current Available Balance:', currentBalance.toFixed(2)]);

//       res.setHeader(
//         'Content-Type',
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       );
//       res.setHeader(
//         'Content-Disposition',
//         'attachment; filename=Transaction_Statement.xlsx'
//       );
//       await workbook.xlsx.write(res);
//       res.end();
//     } else {
//       // ===== PDFKit Implementation with node-pdftk Encryption =====
//       // 1) Create a temporary file path for the unencrypted PDF.
//       const tempUnencrypted = path.join(os.tmpdir(), `unencrypted_${Date.now()}.pdf`);

//       // 2) Generate the PDF with PDFKit and write to the temporary file.
//       const doc = new PDFDocument({ size: 'A4', margin: 40 });
//       const writeStream = fs.createWriteStream(tempUnencrypted);
//       doc.pipe(writeStream);

//       // Write PDF content:
//       doc.fontSize(18).text('PayCheck - Transaction Statement', { align: 'center' });
//       doc.moveDown(0.3);
//       if (user) {
//         doc.fontSize(12).text(`User: ${user.firstName} ${user.lastName}`, { align: 'center' });
//         doc.moveDown(0.3);
//       }
//       doc.fontSize(12)
//          .text(`Statement Period: ${start.toDateString()} - ${end.toDateString()}`, { align: 'center' })
//          .moveDown(1);

//       // Summary
//       doc.fontSize(12)
//          .text(`Total Income (Credit): ${totalIncome.toFixed(2)}`)
//          .text(`Total Spent (Debit): ${totalSpent.toFixed(2)}`)
//          .text(`Current Available Balance: ${currentBalance.toFixed(2)}`)
//          .moveDown(1);

//       // Table Header
//       const startX = 50;
//       let startY = doc.y;
//       const columnWidths = [80, 150, 60, 60];
//       doc.font('Helvetica-Bold').fontSize(10);
//       doc.text('Date', startX, startY, { width: columnWidths[0] });
//       doc.text('Description', startX + columnWidths[0], startY, { width: columnWidths[1] });
//       doc.text('Credit', startX + columnWidths[0] + columnWidths[1], startY, {
//         width: columnWidths[2],
//         align: 'right',
//       });
//       doc.text('Debit', startX + columnWidths[0] + columnWidths[1] + columnWidths[2], startY, {
//         width: columnWidths[3],
//         align: 'right',
//       });
//       doc.moveTo(startX, startY + 15).lineTo(500, startY + 15).stroke();

//       // Table Rows
//       doc.font('Helvetica').fontSize(10);
//       let y = startY + 20;
//       const rowHeight = 20;
//       tableRows.forEach((row) => {
//         if (y + rowHeight > doc.page.height - 50) {
//           doc.addPage();
//           y = 50;
//         }
//         doc.text(row.date, startX, y, { width: columnWidths[0] });
//         doc.text(row.description, startX + columnWidths[0], y, { width: columnWidths[1] });
//         doc.text(row.credit, startX + columnWidths[0] + columnWidths[1], y, {
//           width: columnWidths[2],
//           align: 'right',
//         });
//         doc.text(row.debit, startX + columnWidths[0] + columnWidths[1] + columnWidths[2], y, {
//           width: columnWidths[3],
//           align: 'right',
//         });
//         y += rowHeight;
//       });

//       // Final Summary
//       doc.moveDown(1).font('Helvetica-Bold').fontSize(10);
//       doc.text('--- End of Transactions ---', { align: 'center' });
//       doc.moveDown(1);
//       doc.fontSize(12);
//       doc.text(`Total Income (Credit): ${totalIncome.toFixed(2)}`, { align: 'right' });
//       doc.text(`Total Spent (Debit): ${totalSpent.toFixed(2)}`, { align: 'right' });
//       doc.text(`Current Available Balance: ${currentBalance.toFixed(2)}`, { align: 'right' });

//       // (Optional) Add footers if you like
//       doc.end();

//       // 3) When PDFKit finishes writing, encrypt with node-pdftk
//       writeStream.on('finish', async () => {
//         try {
//           pdftk
//           .input(tempUnencrypted)
//           // encrypt(ownerPassword, userPassword, encryptionStrength)
//           .encrypt(userPin, userPin, '128bit')
//           .output()
//           .then(async (encryptedBuffer) => {
//             // Send the encrypted PDF to the client
//             res.setHeader('Content-Type', 'application/pdf');
//             res.setHeader('Content-Disposition', 'attachment; filename=Transaction_Statement.pdf');
//             res.send(encryptedBuffer);
        
//             // Cleanup temporary file
//             await unlinkAsync(tempUnencrypted);
//           })
//             .catch((err) => {
//               console.error('Error encrypting PDF with pdftk:', err);
//               res.status(500).json({ message: 'Error encrypting PDF' });
//             });
//         } catch (err) {
//           console.error('Error during encryption process:', err);
//           res.status(500).json({ message: 'Error during encryption process' });
//         }
//       });
//     }
//   } catch (error) {
//     console.error('Error generating statement:', error);
//     res.status(500).json({ message: error.message });
//   }
// });


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