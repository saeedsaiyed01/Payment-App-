import axios from 'axios';
import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { AppBar } from '../components/Appbar';
const API_URL = import.meta.env.VITE_BACKEND_URL;

export const TransactionReport = () => {
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  // This will store the transformed rows with separate Credit/Debit columns
  const [tableRows, setTableRows] = useState([]);

  // Keep track of totals
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // The user can choose PDF or Excel
  const [downloadFormat, setDownloadFormat] = useState('pdf');

  // 1) Fetch raw transactions from the server
  const fetchTransactions = async () => {
    const startDate = range.startDate.toISOString().split("T")[0];
    const endDate = range.endDate.toISOString().split("T")[0];

    try {
      const response = await axios.get(
        `${API_URL}/api/v1/account/transaction?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Process the raw transactions to separate credit/debit columns and compute totals
      processTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // 2) Transform transactions into table rows with Credit and Debit (no running balance)
  const processTransactions = (transactions) => {
    let income = 0;
    let spent = 0;

    const rows = transactions.map((txn) => {
      let creditVal = "";
      let debitVal = "";

      if (txn.type === "credit") {
        creditVal = txn.amount;
        income += txn.amount;
      } else {
        debitVal = txn.amount;
        spent += txn.amount;
      }

      return {
        date: new Date(txn.date).toLocaleDateString(),
        description: txn.name,
        credit: creditVal,
        debit: debitVal,
      };
    });

    setTableRows(rows);
    setTotalIncome(income);
    setTotalSpent(spent);
  };

  // 3) Download PDF or Excel depending on the user’s selection
  const downloadPDF = async () => {
    const startDate = range.startDate.toISOString().split("T")[0];
    const endDate = range.endDate.toISOString().split("T")[0];
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/account/transaction/download?startDate=${startDate}&endDate=${endDate}&format=pdf`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob', // Expect binary blob response
        }
      );
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Transaction_Statement.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const downloadExcel = async () => {
    const startDate = range.startDate.toISOString().split("T")[0];
    const endDate = range.endDate.toISOString().split("T")[0];
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/account/transaction/download?startDate=${startDate}&endDate=${endDate}&format=excel`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Transaction_Statement.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  const downloadStatement = () => {
    if (downloadFormat === 'pdf') {
      downloadPDF();
    } else {
      downloadExcel();
    }
  };

  return (
<div>

        <AppBar />
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {/* <h1 style={{ textAlign: 'center', color: '#333' }}>Download Transaction Report</h1> */}

      {/* Date Range Picker */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <DateRangePicker
          ranges={[range]}
          onChange={(ranges) => setRange(ranges.selection)}
        />
      </div>

      {/* Buttons for fetching data and selecting format */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          style={{ margin: '0 10px', padding: '10px 20px', cursor: 'pointer' }}
          onClick={fetchTransactions}
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg font-medium"
        >
          Fetch Transactions
        </button>

        <select
          // style={{ margin: '0 10px', padding: '10px', cursor: 'pointer' }}
          value={downloadFormat}
            className="bg-gradient-to-r from-purple-600 to-blue-500  text-white px-6 py-2 rounded-lg font-medium "
          onChange={(e) => setDownloadFormat(e.target.value)}
        >
          <option value="pdf" className='text-black'>PDF</option>
          <option value="excel" className='text-black'>Excel</option>
        </select>

        <button
          style={{ margin: '0 10px', padding: '10px 20px', cursor: 'pointer' }}
          onClick={downloadStatement}
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg font-medium "
        >
          Download Statement
        </button>
      </div>

      {/* Display the fetched transactions in a table (NO Balance column) */}
      <div style={{ overflowX: 'auto' }}>
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}
        >
          <thead   className="bg-gradient-to-r from-purple-600 to-blue-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium ">
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Credit</th>
              <th>Debit</th>
           
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.description}</td>
                <td style={{ color: 'green' }}>{row.credit || ''}</td>
                <td style={{ color: 'red' }}>{row.debit || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary row */}
      {tableRows.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <p>Total Income (Credit): <strong style={{ color: 'green' }}>{totalIncome}</strong></p>
          <p>Total Spent (Debit): <strong style={{ color: 'red' }}>{totalSpent}</strong></p>
          {/* No closing balance or running balance */}
        </div>
      )}
        
</div>
    </div>
  );
};
