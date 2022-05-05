const mailer = require("nodemailer");

const transporter: any = mailer.createTransport({
  service: "gmail",
  port: 2525,
  secure: false,
  auth: {
    user: "sendmail.smtp011@gmail.com",
    pass: "plhjcvrsyxwjlazx"
  }
});

/**
 * Sends message using nodemailer
 * @param {string} title - Title of the message
 * @param {string} message - Message
 * @param {string} to - Who will receive the message
 * @param {function} func - Function callback
 * @return{function} func -  Callback with result
 */
export default async function sendMessage(message: string, title: string, to: string, func: any) {

  //Sends message
  const mailResult: any | null = await transporter.sendMail({
    from: "Blog Angular <sendmail.smtp011@gmail.com>",
    to: to,
    subject: title,
    html: message
  });

  return func(mailResult);

}
