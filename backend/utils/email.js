const nodemailer = require('nodemailer');

// Function to send email
const sendEmail = async (email, subject, message) => {
    // Create a transporter using SMTP transport
    const myEmail = 'vedansh@isuremedia.com';
    const transporter = nodemailer.createTransport({
        // Configure your email service provider here
        // Example using Gmail SMTP:

        service: 'gmail',
        auth: {
            user: process.env.MAILUSER, // Your email address
            pass: process.env.MAILPASSWORD  // Your email password (use environment variables in production)
        }
    });

    // Define email options
    const mailOptions = {
        from: "vedansh kanapal" + process.env.MAILUSER, // Sender email address
        to: email, // Recipient email address
        subject: subject, // Email subject
        text: message // Plain text body
        // You can also use html property for HTML content
    };

    // Send email using the transporter
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;