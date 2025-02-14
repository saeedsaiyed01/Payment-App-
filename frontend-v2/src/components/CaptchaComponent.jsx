import axios from "axios";
import { useEffect, useState } from "react";
require('dotenv').config()


const CaptchaComponent = () => {
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaText, setCaptchaText] = useState('');

    useEffect(() => {
        // Fetch the CAPTCHA from the server
        const fetchCaptcha = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/v1/captcha`);
                setCaptchaImage(response.data.captchaImage);
                setCaptchaText(response.data.captchaText);

                // Store the CAPTCHA text in local storage
                localStorage.setItem('captchaText', response.data.captchaText);
            } catch (error) {
                console.error('Error fetching CAPTCHA:', error);
            }
        };

        fetchCaptcha();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userInputCaptcha = e.target.captcha.value;
        
        // Retrieve the CAPTCHA text from local storage
        const storedCaptcha = localStorage.getItem('captchaText');

        if (userInputCaptcha === storedCaptcha) {
            console.log('CAPTCHA validated successfully!');
            // Proceed with form submission
        } else {
            console.log('CAPTCHA validation failed.');
            // Handle CAPTCHA validation failure
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <img src={captchaImage} alt="CAPTCHA" />
            </div>
            <input type="text" name="captcha" placeholder="Enter CAPTCHA" required />
            <button type="submit">Submit</button>
        </form>
    );
};

export default CaptchaComponent;