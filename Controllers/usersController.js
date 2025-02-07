

import { userModel } from '../Model/registerModel.js';
import bcrypt from 'bcryptjs';
import express from 'express';

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
        res.status(201).json({ message:  `${userType} Registration Successful` });
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

export { user_registration, addNewCoach };
