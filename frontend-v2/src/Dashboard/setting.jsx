import axios from "axios";
import { useEffect, useState } from "react";
import { AppBar } from "../components/Appbar";
const API_URL = import.meta.env.VITE_BACKEND_URL;

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userId, setUserId] = useState(null);


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserId(response.data._id); // Extract userId from response
        setFirstName(response.data.firstName || "");
        setLastName(response.data.lastName || "");
        setEmail(response.data.username || ""); // Assuming username is email
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleSaveChanges = async () => {
    if (!userId) {
      alert("User ID not found!");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/v1/user/update-user/${userId}`,
        { firstName, lastName, username: email }, // Ensure key names match your backend
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="">
      <AppBar />
      <div className="max-w-4xl mt-10 pl-96">
        <div className="bg-blue-200 rounded-xl border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {["Profile"].map(
                (tab) => (
                  <button
                    key={tab.toLowerCase()}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`py-4 px-2 border-b-2 font-medium ${activeTab === tab.toLowerCase()
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">


                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
