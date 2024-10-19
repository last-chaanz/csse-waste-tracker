const nodemailer = require("nodemailer");

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: '7594405701db5f',
    pass: 'e776b7d333f984',
  },
});

// Function to send emails
const sendEmail = async (to, subject, text, html) => {
  try {

    let mailDetails = {
        from: 'no-reply@example.com',
        to,
        subject,
        text,
        html
    };
    
    transporter
        .sendMail(mailDetails,
            function (err, data) {
                if (err) {
                    console.log('Error Occurs',err);
                } else {
                    console.log('Email sent successfully',data);
                }
            });

  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = { sendEmail };