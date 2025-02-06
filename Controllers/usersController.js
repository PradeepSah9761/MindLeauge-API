import {managerModel} from '../Model/managerModel.js';
import {StudentAndAlumniModel} from '../Model/StudentAndAlumniModel.js';
import bcrypt from 'bcryptjs';
import express from 'express';
const app=express();
app.use(express.urlencoded({extended:true}));

 
//Manager Registration

const manager_registration = async (req, res) => {
    try {
        const { fullName, phoneNo, email, country, city, logo, boardSkin, schoolName, schoolAddress, schoolClub, payPalId, backupManager, password, confirmPassword } = req.body;

        
        const existPerson = await managerModel
        .findOne({ $or: [{ email }, { phoneNo }] });
        
        if (existPerson) {
            return res.status(400).json({ message: "User already exists wtih mobile no or email" })
        }
        
        // if (!fullName || !phoneNo || !email || !country || !city || !logo || !boardSkin || !schoolName || !schoolAddress || !payPalId || !backupManager || !schoolClub || !password || !confirmPassword) {
        //     return res.status(400).json({ message: "All Fields are required" })
        // }
        if (password != confirmPassword) {
            return res.status(400).json({ message: "Please enter same password in confirm password field" })
        }



        const passwordFromUser = req.body.password;
        const hashPassword = await bcrypt.hash(passwordFromUser, 12);





        const newPerson = new managerModel(
            {
                fullName: fullName,
                phoneNo: phoneNo,
                email: email,
                country: country,
                city: city,
                logo: {
                    filename:req.file.filename,
                    filepath:req.file.path,
                },
                boardSkin: boardSkin,
                schoolName: schoolName,
                schoolAddress: schoolAddress,
                schoolClub: schoolClub,
                payPalId: payPalId,
                backupManager: backupManager,
                password: hashPassword,

            }
        );
        await newPerson.save();
        res.status(201).json({ message: "Person Registration Successfully" });
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({ errors });
        }
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


const StudentOrAlumni_registration =async (req, res) => {

    try {
                const { firstName, lastName, phoneNumber, email, age, country, city, fatherName, fatherEmail, fatherPhone, motherName, motherEmail, motherPhone, schoolName, clubName, payPalId, password, confirmPassword } = req.body;
                const userType = req.params.userType;

        
        const existPerson = await StudentAndAlumniModel
        .findOne({ $or: [{ email }, { phoneNumber }] });
        if (existPerson) {
            return res.status(400).json({ message: "User already exists wtih mobile no or email" })
        }
        
        if (!firstName || !lastName || !phoneNumber || !email || !age || !country || !city  || !schoolName || !clubName || !payPalId || !password || !confirmPassword) {
            return res.status(400).json({ message: "All Fields are required" })
        }
        if (password != confirmPassword) {
            return res.status(400).json({ message: "Please enter same password in confirm password field" })
        }


        const passwordFromUser = req.body.password;
        const hashPassword = await bcrypt.hash(passwordFromUser, 12);


        const newPerson = new StudentAndAlumniModel(
            {
                userType:userType,firstName, lastName, phoneNumber, email, age, country, city, fatherName, fatherEmail, fatherPhone, motherName, motherEmail, motherPhone, schoolName, clubName, payPalId, password: hashPassword

            }
        );
        await newPerson.save();
        res.status(201).json({ message: "Person Registration Successfully" });
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({ errors });
        }
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}












export { manager_registration, StudentOrAlumni_registration };



