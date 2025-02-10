
import { transporter } from '../Config/emailConfig.js';
import { userModel } from '../Model/registerModel.js';
import path from 'path';
import ejs from 'ejs';

// Generate a fixed 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Route: User Login (Send OTP)
const sendEmail = async (req, res) => {
    try {
        const { email, userType, name } = req.body;

        // Check if the user exists
        const user = await userModel.findOne({ email, userType });
        if (!user) return res.status(400).json({ message: "Email not associated with User Type" });

        // Generate OTP & Expiry
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
        await user.save();


        const templatePath = path.join(process.cwd(), 'views', 'emailTemplate.ejs');


        // Render the EJS template with dynamic data
        const htmlContent = await ejs.renderFile(templatePath, {
            name: name,
            otp: otp
        },{ async: true });

        // Email Configuration
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            html: htmlContent,
       
        };

        // Send email
        transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                console.error("Email Error:", err);
                return res.status(500).json({ message: "Failed to send OTP", error: err.message });
            }
            console.log("Email sent:", info.response);
            res.status(200).json({ message: "OTP sent to email", info });
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export { sendEmail };

