import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar } from "../components/Appbar";
import { BottomWarning } from "../components/BottomWar";
import { InputBox } from "../components/InputBox";
import InputBoxPass from "../components/InputBoxPass";
import { InputBoxPin } from "../components/InputBoxPin";
require('dotenv').config()
export const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    pin: ["", "", "", ""],
    confirmPin: ["", "", "", ""],
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (field, value) => {
    let error = "";

    if (typeof value === "string" && !value.trim()) {
      error = `${field} is required`;
    }

    if (field === "username" && typeof value === "string" && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Invalid email format";
    }

    if (field === "password" && typeof value === "string" && value.length > 0 && value.length < 6) {
      error = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const { firstName, lastName, username, password, pin, confirmPin } = formData;
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!username.trim()) newErrors.username = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) newErrors.username = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (pin.includes("")) newErrors.pin = "All PIN fields are required";
    if (confirmPin.includes("")) newErrors.confirmPin = "All confirm PIN fields are required";
    if (pin.join("") !== confirmPin.join("")) newErrors.confirmPin = "PINs do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    try {
      const { firstName, lastName, username, password, pin } = formData;
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/signup`, {
        username,
        firstName,
        lastName,
        password,
        pin: pin.join(""),
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: error.response?.data?.message || "Signup failed. Please try again.",
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <AppBar />
      <div className="flex items-center justify-center flex-grow">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
          className="w-96 bg-white shadow-lg  m-6 p-5 rounded-xl border border-gray-200"
        >
          <h2 className="text-blue-600 text-xl font-bold text-center">Sign Up</h2>
          <p className="text-gray-500 text-center mb-4">Create your account</p>
          <div className="space-y-3">
            <InputBox label="First Name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

            <InputBox label="Last Name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

            <InputBox label="Email" value={formData.username} onChange={(e) => handleInputChange("username", e.target.value)} />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

            <InputBoxPass label="Password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <InputBoxPin label="Create PIN" pin={formData.pin} setPin={(value) => handleInputChange("pin", value)} />
            {errors.pin && <p className="text-red-500 text-sm">{errors.pin}</p>}

            <InputBoxPin label="Confirm PIN" pin={formData.confirmPin} setPin={(value) => handleInputChange("confirmPin", value)} />
            {errors.confirmPin && <p className="text-red-500 text-sm">{errors.confirmPin}</p>}

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg transition duration-300 text-sm" onClick={handleSignup}>
              Sign Up
            </button>
            {errors.form && <p className="text-red-500 text-sm mt-2">{errors.form}</p>}
          </div>
          <BottomWarning label="Already have an account?" buttonText="Sign In" to="/signin" />
        </motion.div>
      </div>

    </div>
  );
};
