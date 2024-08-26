const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
            //send mail

        })



        // Send email
        let info = await transporter.sendMail({
            from: `"StudyNotion" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <div style="background-color: #ff6f61; padding: 20px; border-radius: 10px; text-align: center;">
                <h1 style="color: #fff; font-size: 24px;">🔒 Secure Your Account 🔒</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; margin-top: 20px;">
                <h2 style="color: #ff6f61;">Hello,</h2>
                <p style="font-size: 16px; line-height: 1.5;">
                    Your One-Time Password (OTP) for account verification is:
                </p>
                <p style="font-size: 36px; font-weight: bold; text-align: center; color: #ff6f61; margin: 20px 0;">
                    ${body}
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Please enter this OTP in the application to verify your account. This OTP is valid for 10 minutes.
                </p>
                <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
                    If you did not request this, please ignore this email.
                </p>
            </div>
            <div style="margin-top: 30px; font-size: 14px; color: #777; text-align: center;">
                <p>This is an automated email, please do not reply.</p>
                <p>&copy; 2024 StudyNotion. All rights reserved.</p>
            </div>
        </div>`,
        });

        console.log(info);
        return info;

    } catch (error) {
        console.log("In mailSender")
        console.log(error.message)
    }
}


module.exports = mailSender;