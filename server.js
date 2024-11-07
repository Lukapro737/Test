const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual secret key
const RECAPTCHA_SECRET_KEY = 'YOUR_SECRET_KEY';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
    const { name, email, message, 'g-recaptcha-response': recaptchaResponse } = req.body;

    // Verify reCAPTCHA
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
    const response = await axios.post(verifyUrl);
    const { success } = response.data;

    if (success) {
        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service
            auth: {
                user: 'your-email@gmail.com', // Your email
                pass: 'your-email-password', // Your email password
            },
        });

        const mailOptions = {
            from: email,
            to: 'your-email@example.com', // Destination email
            subject: `Message from ${name}`,
            text: message,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Error sending email');
            }
            res.send('Email sent successfully!');
        });
    } else {
        res.status(400).send('reCAPTCHA verification failed');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});