import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AddBalanceButton from './AddBalanceButton';


export const Balance = () => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/account/balance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store JWT in localStorage
          }
        });
        setBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="bg-gradient-to-r bg-purple-200 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <div className="text-white  text-md font-bold text-opacity-80  uppercase tracking-wide">Your Balance</div>
                <div className="text-3xl font-bold text-white">
                    {balance !== null ? (
                        <span className="font-mono">₹{balance.toFixed(2)}</span>
                    ) : (
                        <div className="h-8 bg-white bg-opacity-20 rounded animate-pulse w-32" />
                    )}
                </div>
            </div>
            <AddBalanceButton 
                className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm"
            />
        </div>
    </div>
);
};