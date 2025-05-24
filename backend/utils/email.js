import nodemailer from "nodemailer";

const transporterOptions = {
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
};

const transporter = nodemailer.createTransport(transporterOptions);

const sendEmail = async (emailTo, name, token, purpose) => {
  try {
    const info = await transporter.sendMail({
      from: "no-reply@pd10.com",
      to: emailTo,
      subject: purpose === "register" ? "Verify email" : "Reset Password",
      text:
        purpose === "register"
          ? `Welcome ${name} to Auth Playground,
          to be able to use our services you need to verify your email
          
          click on this link to verify your account: ${process.env.BASE_URL}/auth/verify/${token}
          
          don't share this link with anyone.
  
          `
          : `Forget Password request
          
          click on this link to reset your password: ${process.env.BASE_URL}/auth/reset-password/${token}
          
          don't share this link with anyone.
          
          This link will expire in 15 minutes.
          `,
    });
    console.log("Email send successfully");
  } catch (error) {
    console.log("Error sending email => ", error);
  }
};

export { sendEmail };
