import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Wallet from "../icons/wallet";
const API_URL = import.meta.env.VITE_BACKEND_URL;

export const AppBar = () => {
    const [username, setUsername] = useState("");
    const [lastName, setLastName] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchName = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/user/me`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUsername(response.data.firstName);
                setLastName(response.data.lastName);
            } catch (error) {
                console.error('Error fetching name:', error);
            }
        };

        fetchName();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <div className="bg-white shadow-md h-20 flex justify-between items-center px-6 lg:px-12 border-b border-gray-200">
            <div className=" flex  gap-2 text-3xl font-bold text-black bg-clip-text ">
               <Wallet/>PayLink
            </div>

            <div className="flex items-center space-x-6 relative">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-600">Welcome back,</span>
                    <span className="text-lg font-semibold text-gray-900">{username} {lastName}</span>
                </div>
                
                <div 
                    className="relative cursor-pointer"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center shadow-lg hover:shadow-xl transition">
                        <span className="text-white font-bold text-lg">
                            {username?.charAt(0).toUpperCase()}{lastName?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    
                    {isMenuOpen && (
                        <div className="absolute right-0 top-14 w-52 bg-white rounded-lg shadow-lg py-3 z-50 border border-gray-200">
                            <div className="px-4 py-2 text-sm font-semibold text-gray-800 border-b">
                                {username} {lastName}
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition text-left"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
