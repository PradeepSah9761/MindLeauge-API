import managerModel from '../Model/managerModel.js';
import bcrypt from 'bcryptjs';



const manager_registration= async(req,res)=>
{
try
{
    const {fullName,phoneNo,email,country,city, logo,boardSkin,schoolName,schoolAddress,schoolClub,payPalId,backupManager,password,confirmPassword}=req.body;

    const existPerson=await managerModel
.findOne({$or:[{email},{phoneNo}]});
    if(existPerson)
    {
     return res.status(400).json({message:"User already exists wtih mobile no or email"})
    } 
    if(!fullName || !phoneNo || !email || !country || !city || !logo || !boardSkin  || !schoolName || !schoolAddress || !payPalId || !backupManager  || !schoolClub || !password || !confirmPassword)
    {
     return res.status(400).json({message:"All Fields are required"})
    }
    if(password != confirmPassword)
    {
 return res.status(400).json({message:"Please enter same password in confirm password field"})
    }
    
 
   
     const passwordFromUser=req.body.password;
     const hashPassword=await bcrypt.hash(passwordFromUser,12);
     
  
 
 
 
    const newPerson=new managerModel(
     {
         fullName:fullName,
         phoneNo:phoneNo,
         email:email,
         country:country,
         city:city,
         logo:logo,
         boardSkin:boardSkin,
         schoolName:schoolName,
         schoolAddress:schoolAddress,
         schoolClub:schoolClub,
         payPalId:payPalId,
         backupManager:backupManager,
         password:hashPassword,
         
     }
    );
    await newPerson.save();
    res.status(201).json({message:"Person Registration Successfully"});
 }
 catch(err){
    if(err.name==='ValidationError')
    {
const errors=Object.values(err.errors).map(error=>error.message);
return res.status(400).json({errors});
    }
    res.status(500).json({
        message:"Internal Server Error"
    })
 }
}

 export {manager_registration};



