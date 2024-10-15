const nodemailer = require("nodemailer");

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: 'sliit_thuwa@outlook.com',
    pass: 'thuwa123',
  },
});

// Function to send emails
const sendEmail = async (to, subject, text, html) => {
  try {
    const nodemailer = require('nodemailer');

    let mailTransporter =
        nodemailer.createTransport(
            {
                service: 'gmail',
                auth: {
                    user: 'thalathuwa@gmail.com',
                    pass: 'thala@123'
                }
            }
        );
    
    let mailDetails = {
        from: 'thalathuwa@gmail.com',
        to: 'thuwakaran0915@gmail.com',
        subject: 'Test mail',
        text: 'Node.js testing mail for GeeksforGeeks'
    };
    
    mailTransporter
        .sendMail(mailDetails,
            function (err, data) {
                if (err) {
                    console.log('Error Occurs');
                } else {
                    console.log('Email sent successfully');
                }
            });

  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = { sendEmail };
