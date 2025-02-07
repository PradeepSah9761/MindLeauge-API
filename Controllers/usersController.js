

import { userModel } from '../Model/registerModel.js';
import bcrypt from 'bcryptjs';
import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Student/Manager/Alumni Registration API
const user_registration = async (req, res) => {
    try {

        const { fullName, phoneNo, email, country, city, boardSkin, schoolName, schoolAddress, schoolClub, payPalId, backupManager, password, confirmPassword, firstName, lastName, age, fatherName, fatherEmail, fatherPhone, motherName, motherEmail, motherPhone } = req.body;
        const userType = req.params.userType;

        if (!email || !phoneNo) {
            return res.status(400).json({ message: "Email and Phone Number are required" });
        }

        const existPerson = await userModel.findOne({
            $or: [{ email: email }, { phoneNo: phoneNo }]
        });


        if (existPerson) {
            return res.status(400).json({ message: "User already exists with this email or mobile number" });
        }
        if (!password || !confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            userType,
            fullName,
            phoneNo,
            email,
            country,
            city,
            logo: req.file ? {
                filename: req.file.filename,
                filepath: req.file.path
            } : null,
            boardSkin,
            schoolName,
            schoolAddress,
            schoolClub,
            payPalId,
            backupManager,
            password: hashPassword,
            firstName,
            lastName,
            age,
            fatherName,
            fatherEmail,
            fatherPhone,
            motherName,
            motherEmail,
            motherPhone
        });

        await newUser.save();
        res.status(201).json({ message: `${userType} Registration Successful` });
    } catch (err) {
        res.status(500).json({ message: err.message, name: err.name });
    }
};

// Add Coach API
const addNewCoach = async (req, res) => {
    try {
        const { fullName, email, password, yearOfExperience, payPalId, age, rating, phoneNo, country, city, commissions } = req.body;
        const userType = req.params.userType || req.body.userType;

        if (!email || !phoneNo) {
            return res.status(400).json({ message: "Email and Phone Number are required" });
        }

        const existPerson = await userModel.findOne({
            $or: [{ email: email }, { phoneNo: phoneNo }]
        });


        if (existPerson) {
            return res.status(400).json({ message: "Coach already exists with this email or mobile number" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const hashPassword = await bcrypt.hash(password, 10);


        const newCoach = new userModel({
            userType,
            fullName,
            email,
            password: hashPassword,
            yearOfExperience,
            payPalId,
            age,
            rating,
            phoneNo,
            country,
            city,
            commissions,
            logo: req.file ? {
                filename: req.file.filename,
                filepath: req.file.path
            } : null
        });

        await newCoach.save();
        res.status(201).json({ message: "Coach Added Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};





//User Login Via Password
const loginViaPassword = async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        if (email && password && userType) {
            const validUserTypes = userModel.schema.path('userType').enumValues;
            if (validUserTypes.includes(userType)) {
                console.log(validUserTypes);

                const user = await userModel.findOne({ email: email, userType: userType });
                if (user) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if ((user.email === email) && isMatch) {
                        res.send({
                            status: "success",
                            message: "Login Successfull"
                        })
                    }
                    else {
                        res.status(400).json({ message: "Email Or Password doesn't match" })
                    }

                }
                else {
                    res.status(400).json({ message: "Email and  userType is not associated with each other please enter a valid email with valid usertype" })
                }
            }
            else {
                res.send({ status: "failed", message: "please select a valid user type for ['student','manager','coach','alumni'" })
            }


        }
        else {
            res.status(400).json({ message: "Email , Password and userType all are required" })
        }

    }


    catch (error) {
        res.status(500).json({ message: error.message });
    }
}






// Nodemailer transporter

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },

});

// Generate OTP Function
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Route: User Login (Send OTP)
const loginViaOTP = async (req, res) => {
    const { email, userType } = req.body;

    const user = await userModel.findOne({ email, userType });
    if (!user) return res.status(400).json({ message: "Email not associated with User Type" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: "OTP sent to email" });
    });
};




// Route: Verify OTP
const verifyOTP = async (req, res) => {
    const { email, otp, userType } = req.body;
    if (!email || !otp || !userType) {
        res.status(400).json({ message: "All Fields are required" });
    }

    const user = await userModel.findOne({ email, userType });
    if (!user) return res.status(400).json({ message: "User not found with User Type" });

    if (user.otp !== otp || user.otpExpires < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "OTP verified, login successful" });
};





//Forget Password
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.send({ status: "failed", message: "Please enter the email, It's required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email not found" });

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // OTP valid for 2 mins

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It expires in 2 minutes.`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) return res.status(500).json({ message: "There is error in sending the email" });
            res.status(200).json({ message: "OTP sent to email for password reset" });
        });
    } catch (err) {
        res.status(500).json({ message: "The Internal Server Error" });
    }
};




// Reset The Password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        }
        //Validate Email from the database
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email not found" });

        // Validate OTP
        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password & clear OTP fields
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: "Password changed successfully,Now you can login with new password" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



//exporting function by named 
export { user_registration, addNewCoach, loginViaOTP, verifyOTP, forgetPassword, resetPassword, loginViaPassword };
