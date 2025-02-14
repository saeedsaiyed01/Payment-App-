import React, { useRef } from "react";

export function InputBoxPin({ label, pin, setPin }) {
    const inputRefs = useRef([]);

    const handlePinChange = (index, value) => {
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Move focus to the next input box if the current box is filled
        if (value.length === 1 && index < pin.length - 1) {
            inputRefs.current[index + 1].focus();
        }

        // Move focus to the previous input box if the current box is emptied
        if (value === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div>
            <div className="text-sm font-medium text-black text-left py-2">
                {label}
            </div>
            <div className="flex justify-center space-x-2">
                {pin.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="password"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                        className="w-12 h-12 text-center border border-gray-400 rounded-md text-xl"
                    />
                ))}
            </div>
        </div>
    );
}
