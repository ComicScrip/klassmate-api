const nodemailer = require('nodemailer');
const {
  RESET_PASSWROD_FRONT_URL,
  EMAIL_SENDER,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
} = require('./env');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const sendResetPasswordEmail = (user, token) =>
  new Promise((resolve, reject) => {
    const mailContent = `${RESET_PASSWROD_FRONT_URL}?userId=${user.id}&token=${token}`;

    transporter.sendMail(
      {
        from: EMAIL_SENDER,
        to: user.email,
        subject: 'Reset your password',
        text: mailContent,
        html: mailContent,
      },
      (err, info) => {
        if (err) reject(err);
        else resolve(info);
      }
    );
  });

module.exports = {
  emailer: transporter,
  sendResetPasswordEmail,
};
