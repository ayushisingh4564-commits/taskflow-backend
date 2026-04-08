import nodemailer from 'nodemailer';

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your TaskFlow OTP Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; 
                  padding: 32px; border-radius: 12px; background: #f9f9f9;">
        <h2 style="color: #7c6dfa;">⚡ TaskFlow</h2>
        <p>Your OTP verification code is:</p>
        <h1 style="letter-spacing: 8px; color: #333;">${otp}</h1>
        <p style="color: #888;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #888; font-size: 12px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTP;