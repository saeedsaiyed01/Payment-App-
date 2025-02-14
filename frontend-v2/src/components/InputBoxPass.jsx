import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputBoxPass = ({ onChange, placeholder, label, type }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleTogglePassword = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="text-sm font-medium text-black text-left py-2 relative"> {/* Added relative positioning here */}
            {label}
            <div className="relative text-black"> {/* Container for input and icon */}
            <input
  type={isPasswordVisible ? "text" : type || "password"}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-3 py-2 border rounded border-gray-300 mt-1 pr-10"
/>
                <span
                    onClick={handleTogglePassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-black "
                >
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
        </div>
    );  
};

export default InputBoxPass;
