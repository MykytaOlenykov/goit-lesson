const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

async function sendEmail(template, { userEmail, userMessage }) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL, // sender address
    to: userEmail, // list of receivers
    subject: "Email for director", // Subject line
    text: userMessage, // plain text body
    html: template, // html body
  });

  console.log("Message sent: %s", info.messageId);

  return true;
}

module.exports = sendEmail;
