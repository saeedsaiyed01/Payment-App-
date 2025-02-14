// TransactionsList.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TransactionItem } from './transactionIteam';
export const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Use axios.get to perform a GET request.
        const response = await axios.get('http://localhost:3000/api/v1/account/transaction', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store JWT in localStorage
          }
        });

        // Directly access response.data as it is already parsed.
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="bg-blue-200 rounded-xl border border-gray-200 mt-4 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              <option>All Categories</option>
              <option>Transfer</option>
              <option>Income</option>
              <option>Expense</option>
            </select>
            <a href="#" className="text-purple-600 text-sm font-medium">
              View all
            </a>
          </div>
        </div>
      </div>

      {/* Transaction Items */}
      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction._id}  // _id comes from MongoDB
            type={transaction.type}
            name={transaction.name}
            date={new Date(transaction.date).toLocaleDateString()} // Format the date as desired
            amount={transaction.amount}
            category={transaction.category}
            status={transaction.status}
          />
        ))}
      </div>
    </div>
  );
};
