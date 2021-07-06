const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //Create a transporter with the options
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  // Create a message for the transporter.
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    subject: options.subject,
    to: options.email,
    text: options.message,
  };

  // Send email using the transporter and pass in the message
  const info = await transporter.sendMail(message);
};

module.exports = sendEmail;
