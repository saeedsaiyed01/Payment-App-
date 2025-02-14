import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";


export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [loggedInUserId, setLoggedInUserId] = useState(null);

 
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
                console.error("No token found in local storage");
            return;
        }

        const fetchLoggedInUserAndUsers = async () => {
            try {
                const userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const currentUserId = userResponse.data._id;
                setLoggedInUserId(currentUserId);

                const usersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/bulk?filter=${filter}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (usersResponse.data.users) {
                    setUsers(usersResponse.data.users.filter(user => user._id !== currentUserId));
                } else {
                    console.error("No users found in the response");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchLoggedInUserAndUsers();
    }, [filter]);
// Users.jsx

    // ... existing code ...

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="text-3xl font-bold text-gray-800 mb-6">All Users</div>
            <div className="mb-6 relative">
                <input 
                    onChange={(e) => setFilter(e.target.value)} 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                />
                <svg 
                    className="absolute right-3 top-3.5 h-6 w-6 text-gray-400"
                    fill="none" 
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <div className="space-y-4">
                {users.map(user => <User key={user._id} user={user} />)}
            </div>
        </div>
    );
};

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-400 text-white font-bold text-xl">
                    {user.firstName[0]}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>
            <Button 
                onClick={() => navigate(`/send?id=${user._id}&name=${user.firstName}`)} 
                label={"Send Money"}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
            />
        </div>
    );
}