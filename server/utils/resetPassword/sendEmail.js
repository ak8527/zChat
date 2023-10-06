import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';

const sendEmail = (user, cb) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // Reusable tranporter object
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // Render email template
  ejs.renderFile(
    path.join(__dirname, 'email.ejs'),
    { user: user },
    (err, data) => {
      if (err) {
        throw err;
      }

      // Send email to user
      transporter.sendMail(
        {
          from: 'help@zchat.com',
          to: user.email,
          subject: 'Reset Password',
          html: data,
        },
        (err, info) => {
          if (err) {
            const error = new Error('Reset password email sent failed');
            throw error;
          }
          cb();
        }
      );
    }
  );
};

export default sendEmail;
