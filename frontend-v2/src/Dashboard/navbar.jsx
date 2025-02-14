// Navbar Component
import axios from "axios";
import React, { useEffect, useState } from "react";
export const Navbar = () => {

  const [showNotifications, setShowNotifications] = useState(false);
  const [username, setUsername] = useState("");
  const [lastName, setlastName] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsername(response.data.firstName);
        setlastName(response.data.lastName);
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    fetchName();
  }, []); // Dependency array ensures this runs only once on mount


  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome , {username}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="absolute top-1 right-1 w- h-2 bg-red-500 rounded-full"></span>
            🔔
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Notifications</h3>
                <button className="text-sm text-indigo-200">Mark all as read</button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">New feature available</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">Your transfer was successful</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full h-12 w-12 bg-purple-600 flex justify-center items-center mt-1 mr-2">
            <div className="text-xl font-semibold">
              {username ? username.charAt(0).toUpperCase() : `${username}`}
              {lastName ? lastName.charAt(0).toUpperCase() : ""}
            </div>
          </div>
          {/* <div className="hidden md:block">
            <p className="text-md font-medium">{username}</p>
            <p className="text-md text-gray-500">{lastName}</p>
          </div> */}
        </div>
      </div>
    </div>

  );
};