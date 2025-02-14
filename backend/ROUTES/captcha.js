const express = require('express');
const svgCaptcha = require('svg-captcha');
const router = express.Router();

// Route to generate CAPTCHA
router.get('/captcha', (req, res) => {
    try {
        console.log('CAPTCHA route accessed');
        
        // Generate CAPTCHA
        const captcha = svgCaptcha.create({
            size: 6,
            ignoreChars: '0o1l',
            width: 100,
            height: 40,
            fontSize: 50,
            noise: 3,
            color: true,
        });

        // Send the CAPTCHA text and data to the client
        console.log('Generated CAPTCHA:', captcha.text);

        res.status(200).json({
            captchaText: captcha.text,
            captchaData: captcha.data
        });
    } catch (error) {
        console.error('Error generating CAPTCHA:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;