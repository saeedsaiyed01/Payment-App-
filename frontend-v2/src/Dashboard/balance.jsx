// Balance Card Component
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Growth from "../icons/growth";
require('dotenv').config()

export const BalanceCard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/account/balance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Total Balance Card */}
      <div className="bg-purple-600 text-white px-6 py-4 rounded-2xl w-full lg:w-[500px]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white text-lg font-medium mt-1">Total Balance</p>
            <h3 className="text-3xl font-bold">
              {balance !== null ? `$${Math.ceil(balance)}` : "Loading..."}
            </h3>
            <div className="flex items-center text-md gap-2 text-white mt-2">
              <span>
                <Growth />
              </span>
              <p>+2.5% from last month</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/addBalance")}
            className="text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Add Money
          </button>
        </div>
      </div>

      {/* Send Money Card */}
      <div className="bg-purple-600 text-white px-6 py-4 rounded-2xl w-full lg:w-[500px]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white text-lg font-medium mt-1">Send Money</p>
            <h3 className="text-2xl font-bold">Choose Recipient</h3>
            <button
              onClick={() => navigate("/transfer")}
              className="mt-3 bg-white text-black hover:bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
