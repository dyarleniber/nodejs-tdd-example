const nodemailer = require("nodemailer");
const mailConfig = require("../../config/mail");

class MailService {
  send(message) {
    const transporter = nodemailer.createTransport(mailConfig);

    return transporter.sendMail(message);
  }
}

module.exports = new MailService();
