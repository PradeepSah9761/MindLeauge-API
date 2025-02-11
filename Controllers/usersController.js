

import { userModel } from '../Model/registerModel.js';
import bcrypt from 'bcryptjs';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import {transporter} from '../Config/emailConfig.js';
import {sendEmailWithSignUp} from '../Services/mailService.js';
// import emailTemplate from '../views/emailTemplate.js';


dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



    // Student/Manager/Alumni Registration API
    

import { fileURLToPath } from 'url';


// Fix for __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Student/Manager/Alumni Registration API
const user_registration = async (req, res) => {
    try {
        const { 
            fullName, phoneNo, email, country, city, boardSkin, schoolName, schoolAddress, 
            schoolClub, payPalId, backupManager, password, confirmPassword, firstName, 
            lastName, age, fatherName, fatherEmail, fatherPhone, motherName, motherEmail, motherPhone 
        } = req.body;

        const userType = req.params.userType;
        const logo = req.file ? req.file.filename : null; 

        //  Validate Required Fields
        if (!email || !phoneNo) {
            return res.status(400).json({ message: "Email and Phone Number are required" });
        }

        //  Check if User Already Exists
        const existPerson = await userModel.findOne({
            $or: [{ email }, { phoneNo }]
        });

        if (existPerson) {
            return res.status(400).json({ message: "User already exists with this email or mobile number" });
        }

        // Validate Password
        if (!password || !confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash Password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create New User
        const newUser = new userModel({
            userType, fullName, phoneNo, email, country, city,  boardSkin, schoolName,
            schoolAddress, schoolClub, payPalId, backupManager, password: hashPassword,
            firstName, lastName, age, fatherName, fatherEmail, fatherPhone, motherName, motherEmail, motherPhone,logo
        });

        const user = await newUser.save();

        //  Send Email with OTP
        await sendEmailWithSignUp(user);
       


        //  Success Response
        res.status(201).json({ 
            message: `${userType} Registration Successful! OTP sent to your email. Please verify within 5 minutes.` 
        });

    } catch (err) {
        res.status(500).json({ message: err.message, name: err.name });
    }
};




// Add Coach API
const addNewCoach = async (req, res) => {
    try {
        const { fullName, email, password, yearOfExperience, payPalId, age, rating, phoneNo, country, city, commissions } = req.body;
        const userType = req.params.userType || req.body.userType;
        const logo = req.file ? req.file.filename : null; 
        

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
            logo,
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
        }); 

        const user=await newCoach.save();
        await sendEmailWithSignUp(user);
        res.status(201).json({ message: `Coach Added Successfully And Email is  send at ${user.email} Please login within 5 minute otherwise it will expired` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};





//User Login Via Password
const loginViaPassword = async (req, res) => {
    try {
        const verified= await userModel.findOne({email:req.body.email});
        if(verified && !verified.isVerified)
        {
              res.send({status:"failed",message:"please verify the mail first then try to login "});
              return res.redirect('/signin-otp');
        }



        const { email, password, userType } = req.body;
        if (email && password && userType) {
            const validUserTypes = userModel.schema.path('userType').enumValues;
            if (validUserTypes.includes(userType)) {
                
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








// Generate OTP Function
function generateOTP() {
    return Math.floor(Math.random()*1000000+1).toString(); //Genrate 6 Digit Code and convert into string
}



//Resend The OTP

const resendOTP=async(req,res)=>
{

    const {email}=req.body;
    const user= await userModel.findOne({email});
    if(!email)
    {
        res.status(400).json({
            message:"Please enter a email address to proceed it "
        })
    }
    if(!user)
    {
        res.send({status:"failed", message:"Email not found"})
    }
     await sendEmailWithSignUp(user);
     res.send({status:"success" ,message:"Here is your new password , Now you can login within 5 minute"})


}



// Route: Verify OTP
const verifyOTP = async (req, res) => {
    const { email, otp, userType } = req.body;
    if (!email || !otp || !userType) {
        res.status(400).json({ message: "All Fields are required" });
    }

    const user = await userModel.findOne({ email, userType });
    if (!user) return res.status(400).json({ message: "Email not found with User Type" });

    if (user.otp !== otp || user.otpExpires < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified=true;
    await user.save();

    res.status(200).json({ message: "OTP verified, Now you can login  " });

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

        const mailOption = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It expires in 2 minutes.`,
        };

        transporter.sendMail(mailOption, (err, info) => {
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
export { user_registration, addNewCoach, verifyOTP, forgetPassword, resetPassword, loginViaPassword,resendOTP };
