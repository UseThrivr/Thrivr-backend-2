

// const mailOptions = {
//     from: "Thrivr <no-reply@thrivr.com>",
//     to: email,
//     subject: "Verify your Identity",
//     html: `<!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Email Confirmation</title>
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     background-color: #f9f9f9;
//                     margin: 0;
//                     padding: 20px;
//                 }
//                 .container {
//                     background-color: #fff;
//                     padding: 20px;
//                     border-radius: 10px;
//                     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//                     max-width: 600px;
//                     margin: 0 auto;
//                 }
//                 h1 {
//                     color: #333;
//                     font-size: 24px;
//                     margin-bottom: 10px;
//                 }
//                 h4 {
//                     color: #555;
//                     font-size: 18px;
//                 }
//                 .otp-code {
//                     font-size: 28px;
//                     font-weight: bold;
//                     color: #007BFF;
//                     background-color: #f0f8ff;
//                     padding: 15px;
//                     border-radius: 8px;
//                     display: inline-block;
//                     letter-spacing: 2px;
//                     margin: 15px 0;
//                 }
//                 p {
//                     color: #666;
//                     font-size: 16px;
//                     line-height: 1.8;
//                 }
//                 .footer {
//                     margin-top: 30px;
//                     font-size: 14px;
//                     color: #999;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <h1>Hi ${
//                   name.split(" ").length > 1 ? name.split(" ")[0] : name
//                 }</h1>
//                 <br>
//               Someone just requested a link to change your password. You can do this through the link below.
//               <br>
//               <a href="${
//                 frontendURL + "/forgotpassword/" + token
//               }">Change my password</a>
//               <br>
//               or alternatively copy and paste this link in your browser: 
//               ${frontendURL + "/resetpassword/" + token}
//               <br><br>
//               Please note that this link expires after an hour of receiving this mail, if you did not make this request, Please ignore this email, this link will expire once you click it.
//               Your password wouldn't change until you click the link above. If you have any issues, contact us at:
//               <a href="mailto:lanre2967@gmail.com" target="_blank">reachus@gmail.com</a>
//             </div>
//         </body>
//         </html>      
//   `,
//   };

//   transporter.sendMail(mailOptions, async (error: any, info: any) => {
//     console.log("mailed");
//     if (error) {
//       console.log("error");
//     } else {
//       return true;
//     }
//   });