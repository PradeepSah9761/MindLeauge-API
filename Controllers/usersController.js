
import { userModel } from '../Model/registerModel.js';
import bcrypt from 'bcryptjs';
import express from 'express';
const app = express();
app.use(express.urlencoded({ extended: true }));

// Student/Manager/Alumni Registration API


const user_registration = async(req,res)=>
{
    try {
        
        const { fullName, phoneNo, email, country, city, logo, boardSkin, schoolName, schoolAddress, schoolClub, payPalId, backupManager, password, confirmPassword, firstName, lastName,  age,  fatherName, fatherEmail, fatherPhone, motherName, motherEmail, motherPhone  } = req.body;
        const userType=req.params.userType;

        const existPerson = await userModel.findOne({ $or: [{ email }, { phoneNo }] });

        if (existPerson) {
            return res.status(400).json({ message: "User already exists wtih mobile no or email" })
        }
        if (password != confirmPassword) {
                        return res.status(400).json({ message: "Please enter same password in confirm password field" })
                    }

                    const hashPassword = await bcrypt.hash(req.body.password, 10);
        
        const newCoach = new userModel(
            {                   
                                  userType: userType,
                                fullName: fullName,
                                phoneNo: phoneNo,
                                email: email,
                                country: country,
                                city: city,
                                logo: {
                                    filename: req.file.filename,
                                    filepath: req.file.path,
                                },
                                boardSkin: boardSkin,
                                schoolName: schoolName,
                                schoolAddress: schoolAddress,
                                schoolClub: schoolClub,
                                payPalId: payPalId,
                                backupManager: backupManager,
                                password: hashPassword,
                                firstName: firstName,
                                lastName: lastName,
                                age: age,
                                fatherName: fatherName,
                                fatherEmail: fatherEmail,
                                fatherPhone: fatherPhone,
                                motherName: motherName,
                                motherEmail: motherEmail,
                                motherPhone: motherPhone,
                
            }
        );

        await newCoach.save();
        res.status(201).json({ message: "User Registration Successfully" });
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({ errors });
        }
        res.status(500).json({
            message: err.message,
            name:err.name
        })
    }
}


//Add Coach API



const addNewCoach= async(req,res)=>
    {
        try {
            
            const { logo,fullName,email,password,yearOfExperience,payPalId,age,rating,phoneNo,country,city,commissions } = req.body;
            const userType=req.params.userType;
    
            const existPerson = await userModel
                .findOne({ $or: [{ email }, { phoneNo }] });
    
            if (existPerson) {
                return res.status(400).json({ message: "Coach already exists wtih mobile no or email" })
            }
    
            
            const hashPassword = await bcrypt.hash(req.body.password, 10);
    
            const newCoach= new userModel(
                {
                    userType,
                    fullName,
            email,
            password:hashPassword,
            yearOfExperience,
            payPalId,
            age,
            rating,
            phoneNo,
            country,
            city,
            commissions,
            logo:
            {
                filename:req.file.filename,
                pathname:req.file.path,
            }
    
                }
            );
            await newCoach.save();
            res.status(201).json({ message: "Coach Added Successfully" });
        }
        catch (err) {
            if (err.name === 'ValidationError') {
                const errors = Object.values(err.errors).map(error => error.message);
                return res.status(400).json({ errors });
            }
            res.status(500).json({
                message: err.message
            })
        }
    }


export { user_registration,addNewCoach };



