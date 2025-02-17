import { transporter } from '../Config/emailConfig.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import ejs from 'ejs';


const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);              

// Generate a fixed 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP email
const sendEmailWithSignUp = async (user) => {
    try {
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        // user.otpExpires=moment().add(5,"minutes").toDate();


        await user.save();

        const templatePath = path.join(__dirname, '../views', 'emailTemplate.ejs');
        const htmlContent = await ejs.renderFile(templatePath, {
            name: user.fullName || user.firstName,
            otp: otp
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "OTP sent for email verification",
            html: htmlContent
        };

        
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("Error sending email:", err);
                    return reject(err);  
                }
                console.log(`Email sent successfully to ${user.email}`);
                resolve(info); 
            });
        });

    } catch (error) {
        console.error("Error in sendEmailWithSignUp:", error);
        throw error;  
    }
};




export { sendEmailWithSignUp };
