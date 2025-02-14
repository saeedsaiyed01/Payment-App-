import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AppBar } from '../components/Appbar';
import { BottomWarning } from '../components/BottomWar';
import { InputBox } from '../components/InputBox';
import PinInput from '../components/PinInput';
import { Checkmark } from '../components/motion';

const AddBalancePage = () => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [balance, setBalance] = useState(null);
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get(`https://payment-app-blush.vercel.app/api/v1/account/balance`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        console.log("Stored Token:", localStorage.getItem('token'));
        fetchBalance();
    }, []);

    const handlePinSubmit = async (pin) => {
        const parsedAmount = parseFloat(amount);

        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        try {
            const response = await axios.post(
                `https://payment-app-blush.vercel.app/api/v1/user/addBalance`,
                { amount: parsedAmount, pin },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                const { newBalance } = response.data;

                setBalance(parseFloat(newBalance));
                setIsPaymentSuccessful(true);
                setError('');
            }
        } catch (error) {
            console.error('API call error:', error);
            setError('Error adding balance, please try again.');
        }
    };

    return (
        <div>
            <AppBar />
            <div className="bg-cover bg-center bg-no-repeat h-screen flex justify-center" style={{ backgroundImage: 'url(bg.jpg)' }}>
                <div className="h-full flex flex-col justify-center">
                    <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-blue-200 shadow-lg rounded-2">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h2 className="text-3xl font-bold text-center text-black">Add Balance</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="space-y-2">

                                    <InputBox onChange={(e) => setAmount(e.target.value)} placeholder="100" label="Amount" />
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                </div>
                                <div className="text-sm font-medium text-left py-2">
                                    <p className="mb-2 text-gray-700">Enter Pin:</p>
                                    <PinInput onSubmit={handlePinSubmit} />
                                </div>
                                {isPaymentSuccessful && (
                                    <div className="flex flex-col items-center">
                                        <Checkmark size={60} strokeWidth={4} color="green" className="mb-4" />
                                        <h3>Payment Successful</h3>
                                        <BottomWarning label="Payment Successful. Back to dashboard" buttonText="Dashboard" to="/dashboard" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-center text-sm text-gray-600">
                            Updated Balance: <span className="font-bold text-black">₹{balance ? balance.toFixed(2) : '0.00'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBalancePage;
