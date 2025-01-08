
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });


  export const sendForgotMail = async (resetLink: string, email: string, name: string) => {
    try {
      const mailOptions = {
        from: "Clark <no-reply@thrivr.com>",
        to: email,
        subject: "Reset your password",
        html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset Request</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                            max-width: 600px;
                            margin: 0 auto;
                        }
                        h1 {
                            color: #333;
                            font-size: 24px;
                            margin-bottom: 10px;
                        }
                        p {
                            color: #666;
                            font-size: 16px;
                            line-height: 1.8;
                        }
                        .reset-link {
                            display: inline-block;
                            background-color: #007BFF;
                            color: #fff;
                            text-decoration: none;
                            font-size: 16px;
                            padding: 12px 20px;
                            border-radius: 5px;
                            margin-top: 20px;
                        }
                        .footer {
                            margin-top: 30px;
                            font-size: 14px;
                            color: #999;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Password Reset Request</h1>
                        <p>Hello ${name.split(" ").length > 1 ? name.split(" ")[0] : name},</p>
                        <p>We received a request to reset your password. Click the link below to reset it:</p>
                        <a href="${resetLink}" class="reset-link">Reset My Password</a>
                        <p>If you didn't request this, please ignore this email. Your password will remain safe.</p>
                        <p>The reset link will expire in 1 hour. Please use it before the expiration time.</p>
                        <div class="footer">
                            Best regards,<br>
                            Thrivr
                        </div>
                    </div>
                </body>
                </html>
                `,
      };
  
      transporter.sendMail(mailOptions, async (error: any, info: any) => {
        if (error) {
          console.log("error");
        } else {
          return true;
        }
      });
    } catch (error) {
      return "Error sending mail";
    }
  };