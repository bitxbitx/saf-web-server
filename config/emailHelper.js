const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

const sendEmail = asyncHandler(async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
