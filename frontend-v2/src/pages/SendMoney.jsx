import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";
import { AppBar } from "../components/Appbar";
import { BottomWarning } from "../components/BottomWar";
import { Checkmark } from "../components/motion";
import PinInput from "../components/PinInput";
const API_URL = import.meta.env.VITE_BACKEND_URL;



export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    // Fetch user details including userId
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/user/me`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUserId(response.data._id);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchBalance = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/account/balance`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setBalance(response.data.balance.toFixed(2));
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchUserData();
        fetchBalance();
    }, []);

    const handlePinSubmit = async (pin) => {
        if (!amount || isNaN(amount) || amount.startsWith('0') || amount > balance) {
            setError('Please enter a valid amount.');
            return;
        }

        setError('');
        setIsLoading(true); // Show loader before request

        try {
            const response = await axios.post(`${API_URL}/api/v1/account/transfer`, {
                to: id,
                amount: parseFloat(amount),
                pin
            }, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });

            if (response.status === 200) {
                setTimeout(() => { 
                    setIsSuccess(true);
                    const audio = new Audio('sounds/successed-sound.mp3');
                    audio.play();
                    setBalance(prevBalance => prevBalance - amount);
                    setIsLoading(false); // Hide loader after success
                }, 2000); 
            }
        } catch (error) {
            console.error('Request failed', error);
            setError('Transfer failed. Please try again.');
            setIsLoading(false); // Hide loader if error occurs
        }
    };

    return (
        <div>
            <AppBar />
            <div className="bg-cover bg-center bg-no-repeat h-screen flex justify-center" style={{ backgroundImage: 'url(bg.jpg)' }}>
                <div className="h-full flex flex-col justify-center">
                    <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-blue-200 shadow-lg rounded-2">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h2 className="text-3xl font-bold text-center text-black">Send Money</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                    <span className="text-2xl text-black">💰</span>
                                </div>
                                <h3 className="text-2xl font-semibold text-black">{name}</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-black font-medium" htmlFor="amount">Amount</label>
                                    <input onChange={(e) => setAmount(e.target.value)} type="number" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm" id="amount" placeholder="Enter amount" value={amount} />
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                </div>
                                <PinInput onSubmit={handlePinSubmit} />
                                {isLoading ? (
                                    <div className="flex flex-col items-center">
                                        {/* //<Spinner color="success" aria-label="Processing payment..." /> */}
                                        <BounceLoader color="#87ffb4" />
                                        <h3 className="text-lg font-medium text-black mt-3">Processing Payment...</h3>
                                    </div>
                                ) : isSuccess && (
                                    <div className="flex flex-col items-center">
                                        <Checkmark size={60} strokeWidth={4} color="green" className="mb-4" />
                                        <h3 className="text-lg font-medium text-black">Payment Successful</h3>
                                        <BottomWarning label="Payment Successful. Back to dashboard" buttonText="Dashboard" to="/dashboard" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-center text-sm text-gray-600">
                            Your Balance: <span className="font-bold text-black">${balance}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMoney;
