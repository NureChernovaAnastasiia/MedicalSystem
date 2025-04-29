const nodemailer = require("nodemailer");
const generateReviewEmail = require("../templates/reviewNotificationTemplate");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "karvatnasta@gmail.com",
        pass: "oyzy gjqn dttv xshl",
      },
    });
  }

  async sendMail(to, subject, html) {
    await this.transporter.sendMail({
      from: 'karvatnasta@gmail.com',
      to,
      subject,
      html,
    });
  }

  async sendReviewNotification(to, data) {
    const { subject, html } = generateReviewEmail(data);
    console.log("✅ Sending review email with subject:", subject); // для дебагу
    await this.sendMail(to, subject, html);
  }
}

module.exports = new MailService();
