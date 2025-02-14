import React, { useRef } from 'react';
import { Button } from './Button';



const PinInput = ({ onSubmit }) => {
    const [pin, setPin] = React.useState(['', '', '', '']);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleChange = (index, value) => {
        if (/^\d?$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            // Move focus to the next input if current one is filled
            if (value && index < 3) {
                inputRefs[index + 1].current.focus();
            }
            // Move focus to the previous input if current one is empty
            if (!value && index > 0) {
                inputRefs[index - 1].current.focus();
            }
        }
    };

    const handleSubmit = () => {
        onSubmit(pin.join(''));
    };

    return (
        <div className="flex flex-col items-center space-y-4"> {/* Changed layout to column with space between items */}
            <div className="flex justify-between w-full">
                {pin.map((digit, index) => (
                    <input
                        key={index}
                        ref={inputRefs[index]}
                        type="password"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className="w-12 h-12 text-center border border-gray-400 rounded-md text-xl"
                        inputMode="numeric" // Shows numeric keyboard on mobile devices
                        pattern="\d*" // Allows only digits
                    />
                ))}
            </div>
            <Button onClick={handleSubmit} label="Submit" /> {/* Button moved below the pin input */}
        </div>
    );
};

export default PinInput;
