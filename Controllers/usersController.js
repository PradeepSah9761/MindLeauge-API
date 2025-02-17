import { userModel } from '../Model/registerModel.js';
import bcrypt from 'bcryptjs';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import {transporter} from '../Config/emailConfig.js';
import {sendEmailWithSignUp} from '../Services/mailService.js';
import puppeteer from 'puppeteer';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import ejs from 'ejs';
import validator from 'validator';
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());    
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

        //To Validate Email
        if(!validator.isEmail(email))
        {
            return res.status(401).json({message:" Entered Invalid Email "})
        }
        

        // To Validate MobileNo
        if(!validator.isMobilePhone(phoneNo,'any'))
        {
          return   res.status(401).json({message:"Invalid Mobile No"})
        }

        //To Validate Strong Password
        if(!validator.isStrongPassword(password,{minLength: 8,
            minNumbers: 1}))
        {
           return res.status(401).json({
                message:"Password must be 8 characters long and contain at least 1 number"
                
            })

        }

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
        

        //To Validate Email
        if(!validator.isEmail(email))
            {
               return res.status(401).json({message:" Entered Invalid Email "})
            }
            
    
            // To Validate MobileNo
            if(!validator.isMobilePhone(phoneNo,'any'))
            {
                return res.status(401).json({message:"Invalid Mobile No"})
            }
    
            //To Validate Strong Password
            // if(!validator.isStrongPassword(password,{minLength:8,minNumber:1}))
            // {
            //     return res.status(401).json({
            //         message:"Password must be 8 characters long and contain at least 1 number"
                    
            //     })
    
            // }
    

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
        res.status(201).json({ message: `Coach Added Successfully And Email is  send at ${user.email} Please login within 5 minute ` });
    } catch (err) {
       return res.status(500).json({ message: err.message });
    }
};





//User Login Via Password
const loginViaPassword = async (req, res) => {
    try {
        const verifiedUser= await userModel.findOne({email:req.body.email});
        if(verifiedUser && !verifiedUser.isVerified)
        {
            
             //  Send Email with OTP
             await sendEmailWithSignUp(verifiedUser);
            return  res.send({staus:"failed", message:"You can't login without verifying your email , I have sent an mail in your email account , use otp to verify your account then try to login "})

        }



        const { email, password, userType } = req.body;
        if (email && password && userType) {
            const validUserTypes = userModel.schema.path('userType').enumValues;
            if (validUserTypes.includes(userType)) {
                
                const user = await userModel.findOne({ email: email, userType: userType });
                if (user) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if ((user.email === email) && isMatch) {
                        
                        //Generate JWT Token
                        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
                        res.send({
                            status: "success",
                            message: "Login Successfull",
                            token:token
                        })
                        
                    }
                    else {
                       return  res.status(400).json({ message: "Email Or Password doesn't match" })
                    }

                }
                else {
                   return  res.status(400).json({ message: "Email and  userType is not associated with each other please enter a valid email with valid usertype" })
                }
            }
            else {
               return res.send({ status: "failed", message: "please select a valid user type for ['student','manager','coach','alumni'" })
            }


        }
        else {
           return res.status(400).json({ message: "Email , Password and userType all are required" })
        }

    }


    catch (error) {
       return res.status(500).json({ message: error.message });
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
        return res.status(400).json({
            message:"Please enter a email address to proceed it "
        })
    }
    if(!user)
    {
       return res.send({status:"failed", message:"Email not found"})
    }
     await sendEmailWithSignUp(user);
     res.send({status:"success" ,message:"Here is your new OTP , Please verify it and  Now you can login within 5 minute"})


}



// Route: Verify OTP
const verifyOTP = async (req, res) => {
    const { email, otp, userType } = req.body;
    if (!email || !otp || !userType) {
       return res.status(400).json({ message: "All Fields are required" });
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

        if(!validator.isEmail(email))
        {
            res.status(401).json({
                message:"Invalid Password"
            })
        }

        if (!email) {
           return  res.send({ status: "failed", message: "Please enter the email, It's required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email not found" });

        const otp = generateOTP();
        // const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // OTP valid for 2 mins
        const otpExpires=moment().add(2,"minutes").toDate();


        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const mailOption = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. will expires in 2 minutes. At ${moment(otpExpires).format("YYYY-MM-DD HH:mm:ss")}`,
        };

        transporter.sendMail(mailOption, (err, info) => {
            if (err) return res.status(500).json({ message: "There is error in sending the email" });
            res.status(200).json({ message: "OTP sent to email for password reset" });
        });
    } catch (err) {
       return res.status(500).json({ message: "The Internal Server Error" });
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





// Convert Image to base64

function imageToBase64(filePath)
{
    try{
const data=fs.readFileSync(filePath);
const base64=data.toString('base64');
return `data:image/png;base64,${base64}`
    }
    catch(err)
    {
        console.log("there is error in converting image into base64");
    }
}

//To Genrate PDF

const generatePDF = async (req, res) => {
    let browser;
    try {
        const { fullName, schoolName } = req.params;
        const certificateFolder = path.join(__dirname, '../public/CertificatePDF');

        // Generate unique filename using timestamp
        const timestamp = Date.now();
        const pdfFileName = `certificate_${timestamp}.pdf`;
        const pdfPath = path.join(certificateFolder, pdfFileName);

        // Resolve image paths with file:// protocol
        const imagePaths = {
            base64LineBorder:imageToBase64(path.join(__dirname,'../public/images/line-border-3.png')),
            designBorderTop:`file://${path.join(__dirname,'../public/images/design-border-top.png')}`,
            designBorder:`file://${path.join(__dirname,'../public/images/design-border.png')}`,
            base64ChessBg:imageToBase64(path.join(__dirname,'../public/images/chess_bg.png')),
            signature:`file://${path.join(__dirname,'../public/images/signature.png')}`,
            logo:`file://${path.join(__dirname,'../public/images/logo.png')}`,
        };

        // Render EJS template with resolved paths
        const htmlContent = await ejs.renderFile(path.join(__dirname, '../views/league_certificate.ejs'), {
            fullName,
            schoolName,
            imagePaths
        });

        // Save the rendered HTML to a temporary file
        const tempHtmlPath = path.join(__dirname, '../public/temp.html');
        fs.writeFileSync(tempHtmlPath, htmlContent);

        

        // Launch browser and setup page
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Calculate content dimensions
        const { contentWidth, contentHeight } = await page.evaluate(() => ({
            contentWidth: document.documentElement.scrollWidth,
            contentHeight: document.documentElement.scrollHeight
        }));

        // Load the HTML file using the file:// protocol
        await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });

        // Generate PDF
        await page.pdf({
            path: pdfPath,
            printBackground: true,
            width: contentWidth,
            height: contentHeight,
            pageRanges: '1',
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }
        });

        // Send the generated PDF as a response
        res.sendFile(pdfPath);

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).send('Error generating PDF certificate');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};








//Download The PDF
const downloadPDF=async(req,res)=>
{

    let browser;
    try {
        
        const {filename}=req.params;
        const certificateFolder = path.join(__dirname, '../public/CertificatePDF');

        // Generate unique filename using timestamp
        
        const pdfPath = path.join(certificateFolder, filename);
        res.download(pdfPath, filename, (err) => {
            if (err) {
                console.error('Download error:', err);
            }
        });

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).send('Error generating PDF certificate');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};


//exporting function by named 
export { user_registration, addNewCoach, verifyOTP, forgetPassword, resetPassword, loginViaPassword,resendOTP,generatePDF,downloadPDF };
