import User from "../Models/Users";
import Business from "../Models/Business";
import { Response } from "express";
const nodemailer = require("nodemailer");
import bcrypt from "bcryptjs";
import Settings from "../Models/storeSettings";
import ForgotPassword from "../Models/forgotPassword";
import { sendForgotMail } from "../Mailing/forgotPasswordMail";
const jwt = require("jsonwebtoken");
const NodeCache = require( "node-cache" );
const crypto = require("crypto");
const userCache = new NodeCache();
const otpCache = new NodeCache();

interface Auth {
  signup: any;
  login: any;
  verifyOTP: any;
  resendOTP: any;
  forgotPassword: any;
  resetPassword: any;
  businessSignup: any;
}

interface signupRequest {
  fullname: string;
  email: string;
  password: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});


const sendOTP = async (email: string, name: string, otp: number) => {
  try {
    const mailOptions = {
      from: "Thrivr <no-reply@thrivr.com>",
      to: email,
      subject: "Verify your Identity",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Confirmation</title>
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
              h4 {
                  color: #555;
                  font-size: 18px;
              }
              .otp-code {
                  font-size: 28px;
                  font-weight: bold;
                  color: #007BFF;
                  background-color: #f0f8ff;
                  padding: 15px;
                  border-radius: 8px;
                  display: inline-block;
                  letter-spacing: 2px;
                  margin: 15px 0;
              }
              p {
                  color: #666;
                  font-size: 16px;
                  line-height: 1.8;
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
              <h1>Hi ${
                name.split(" ").length > 1 ? name.split(" ")[0] : name
              }</h1>
              <p>We received a request to verify your email address. To complete the process, please use the OTP below:</p>
              <h4>Your One-Time Password (OTP)</h4>
              <div class="otp-code">${otp}</div>
              <p>If you didn't request this, no worries! You can safely ignore this email.</p>
              <p>Thanks for being part of our community! If you need any help, feel free to reach out.</p>
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

const Auth: Auth = {
  signup: async (req: Request | any, res: Response) => {
    try {
      const { fullname, email, password } = req.body;

      if (
        !fullname ||
        !email ||
        !password ||
        fullname.length < 1 ||
        email.length < 1 ||
        password.length < 1
      ) {
        return res.status(400).json({ error: "Bad request." });
      } else {
        let emailExists = await User.findOne({ where: { email: email } });
        let businessExists = await Business.findOne({ where: { email: email } });

        if (!emailExists && !businessExists) {
          let preUser = req.body;
          preUser.role = 'user';
          userCache.set( `user:${email}`, preUser );

          const otp = Math.floor(1000 + Math.random() * 9000);
          otpCache.set( `otp:${email}`, otp );
          sendOTP(email, fullname, otp);
          return res.status(200).json({ success: true, message: 'Proceed to enter OTP.' });
        } else {
          return res.status(422).json({ error: "Email already exists." });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Error." });
    }
  },

  verifyOTP: async (req: Request | any, res: Response) => {
    try {
      const { otp, email } = req.body;

      if (!otp || !email) {
        return res.status(400).json({ error: "Bad request." });
      } else {
        console.log(otpCache.get(`otp:${email}`))
        if (otp != otpCache.get(`otp:${email}`)) {
          return res.status(422).json({
            message: "Incorrect OTP.",
            code: "INVALID_OTP_ENTERED",
          });
        } else {
          let userInfo = userCache.get(`user:${email}`);
          if (userInfo.role == "user") {
            const { fullname, email, password } = userInfo;
            const SALT_ROUNDS = process.env.SALT_ROUNDS as unknown as string;
            const saltRounds: number = parseInt(SALT_ROUNDS || "10", 10);
            const enc = await bcrypt.hash(password, saltRounds);

            User.create({
              name: fullname,
              email: email,
              password: enc,
            }).then((user) => {
              if (user) {
                const { password, ...userRef } =
                  user.dataValues;
                const token = jwt.sign(userRef, process.env.SECRET_KEY, {
                  expiresIn: "24h",
                });

                return res.status(201).json({
                  message: "Success",
                  code: "SIGNUP_COMPLETE",
                  details: "Signup completed.",
                  token: token
                });
              } else {
                return res.status(500).json({
                  message: "Connection error.",
                  code: "CONNECTION_ERR",
                  details: "Error connecting to database.",
                });
              }
            });
          } else if (userInfo.role == "business") {
            const {
              full_name,
              business_name,
              location,
              email,
              phone_number,
              description,
              password,
              image_path
            } = userInfo;
            const SALT_ROUNDS = process.env.SALT_ROUNDS as unknown as string;
            const saltRounds: number = parseInt(SALT_ROUNDS || "10", 10);
            const enc = await bcrypt.hash(password, saltRounds);


            Business.create({
              full_name: full_name,
              business_name: business_name,
              location: location,
              email: email,
              phone_number: phone_number,
              description: description,
              password: enc,
              image_path: image_path
            }).then((user: any) => {
              Settings.create({
                store_id: user.id
              }).then((settings) => {
                if (user && settings) {
                  const { password, ...userRef } =
                    user.dataValues;
                  const token = jwt.sign(userRef, process.env.SECRET_KEY, {
                    expiresIn: "24h",
                  });
  
  
                  return res.status(201).json({
                    message: "Success",
                    code: "SIGNUP_COMPLETE",
                    details: "Signup completed.",
                    user: userRef,
                    settings: settings,
                    token: token
                  });
                } else {
                  return res.status(500).json({
                    message: "Connection error.",
                    code: "CONNECTION_ERR",
                    details: "Error connecting to database.",
                  });
                }                
              })

            });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Server error." });
    }
  },

  resendOTP: async (req: Request | any, res: Response) => {
    try {
        let {email} = req.body;
      
        let { email_, name } = userCache.get(`user:${email}`);;
        if(!userCache.get(`user:${email_}`)){
          return res.status(404).json({error: 'No login process found.'});
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        otpCache.set(`otp:${email_}`, otp );

        sendOTP(email_, name, otp);
        return res.status(200).json({sucess: true, message: 'OTP sent sucessfully.'});
    } catch (error) {
      return res.status(500).json({ error: "Server error." });
    }
  },

  login: async (req: Request | any, res: Response) => {
    try {
      let { email, password } = req.body;

      if (!email || !password || email.length < 1 || password.length < 1) {
        return res.status(400).json({ error: "Bad request." });
      } else {
        let user = await User.findOne({ where: { email: email } });

        if(!user){
          user = await Business.findOne({ where: { email: email } });       
        }

        if (!user) {
          return res.status(404).json({ error: "Invalid credentials." });
        } else {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            const { password, createdAt, updatedAt, ...userRef } =
              user.dataValues;
            const token = jwt.sign(userRef, process.env.SECRET_KEY, {
              expiresIn: "24h",
            });
            return res
              .status(200)
              .json({ success: true, token: token, user: userRef });
          } else {
            return res
              .status(422)
              .json({ success: false, error: "Invalid credentials." });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Server error." });
    }
  },

  forgotPassword: async (req: Request, res: Response) => {
    try {
      interface forgotEmailInterface {
        email: string;
        url: string;
      }

      interface user {
        username: string;
      }

      const { email, url } = req.body as unknown as forgotEmailInterface;

      if (!email || !url) return res.status(400).json({ error: "Bad request. 😥" });

      let user = await Business.findOne({ where: { email: email } });

      if (!user)
        return res.status(404).json({ error: "User does not exist. 😥" });

      const username = user.dataValues.full_name;
      const cryptoToken = crypto.randomBytes(32).toString("hex");

      const info = {
        token: cryptoToken,
        email: email,
      };

      const token = jwt.sign(info, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      ForgotPassword.create({
        token: cryptoToken,
        email: email
      });

      const resetLink = `${url}/forgot-password?token=${token}`;
      sendForgotMail(resetLink, email, username);

      return res.status(200).json({ sucess: true, message: "Proceed to check your mail for password reset link." });
    } catch (error) {
      return res.status(500).json({ error: "Server error." });
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    interface resetPasswordRequest {
      signature: string;
      password: string;
    }

    const { signature, password } = req.body as unknown as resetPasswordRequest;
    const secretKey = process.env.SECRET_KEY;

    if (!signature || !password) {
      return res.status(400).json({ error: "Bad request." });
    }

    let decoded;
    try {
      decoded = jwt.verify(signature, secretKey);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    const { email, token } = decoded as { email: string; token: string };
    if (!email || !token) {
      return res.status(400).json({ error: "Invalid payload." });
    }

    try {
      const validateToken = await ForgotPassword.findOne({
        where: { token, email },
      });
      if (!validateToken) {
        return res.status(422).json({ error: "Invalid token." });
      }

      const SALT_ROUNDS = process.env.SALT_ROUNDS as unknown as string;
      const saltRounds: number = parseInt(SALT_ROUNDS || "10", 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await Business.update({ password: hashedPassword, by_google: false }, { where: { email } });

      await ForgotPassword.destroy({ where: { email } }); // Invalidate token
      return res
        .status(200)
        .json({ success: true, message: "Password changed successfully." });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Server error." });
    }
  },

  businessSignup: async (req: Request | any, res: Response) => {
    try {
      const {
        full_name,
        business_name,
        location,
        email,
        phone_number,
        description,
        password,
      } = req.body;

      if (
        !full_name ||
        !location ||
        !email ||
        !phone_number ||
        !description ||
        !password 
      ) {
        return res.status(400).json({ error: "Bad request." });
      } else {
        let emailExists = await User.findOne({ where: { email: email } });
        let businessExists = await Business.findOne({ where: { email: email } });

        if (!emailExists && !businessExists) {
          let preUser = req.body;
          preUser.role = 'business';
          if ((req as any).file) {
            preUser.image_path = (req as any).file.location; 
          }
          else{
            preUser.image_path = '';
          }
          userCache.set(`user:${email}`, preUser );

          const otp = Math.floor(1000 + Math.random() * 9000);
          otpCache.set(`otp:${email}`, otp );
          sendOTP(email, full_name, otp);
          return res.status(200).json({ success: true, message: 'Proceed to enter OTP.' });
        } else {
          return res.status(422).json({ error: "Email already exists." });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Error." });
    }
  },
};

export default Auth;
