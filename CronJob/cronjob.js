import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { userModel } from '../Model/registerModel.js';
import { sendEmailWithSignUp} from '../Services/mailService.js';
import config from '../Model/connection.js';
import dotenv from 'dotenv';
dotenv.config()

config()

// Cron Job for Every Minute
cron.schedule('* * * * *', () => {
  const localTime = new Date().toLocaleString();
  console.log(`This command will run evey minute:- ${localTime}`);
});

// Cron Job for Every Hour
cron.schedule('0 * * * *', () => {
  const localTime = new Date().toLocaleString();
  console.log(`This command will run every hour:- ${localTime}`);
});

// Cron Job for Every Month (on the 1st at midnight)
cron.schedule('0 0 1 * *', () => {  // Corrected for monthly
  const localTime = new Date().toLocaleString();
  console.log(`This command will run every month ${localTime}`);
});

// Cron job for every Sunday at midnight
cron.schedule('0 0 * * 0', () => { 
  const localTime = new Date().toLocaleString();
  console.log(`This command will run every Sunday`);
});


console.log("Cron jobs scheduled and running.");



// Function To Delete Expires OTP
const deleteExpiredOTPs= async ()=>
{
try{

    const deleteUser = await userModel.updateMany(
        {
            otpExpires:{$lt:new Date()}
        },
        {$set:{
              otp:null,otpExpires:null
        }}
    )
    console.log(`The Otp and Expires OTP is set as null  and Deleted OTP from ${deleteUser.modifiedCount} user`)

}catch(err)
{
    console.log("There is an error to delete the otp from your database",err.message);
}

}

 

//Function to Reminder Email

const reminderEmail = async () => {
    try {

        const users = await userModel.find({ isVerified: false });
        for (const user of users) {
            await sendEmailWithSignUp(user);
            console.log(`Reminder email sent to ${user.email}`);
        }
    } catch (error) {
        console.log("Error sending reminder email", error)
    }

}
//Function To delete unverified user
const unVerified = async () => {
    try {
       const unVerifiedUser= userModel.deleteMany(
            {
                isVerified: false,
            }
        )
        console.log(` ${unVerifiedUser.deleteCount} user deleted who is unverified from your database `)

    } catch (err) {
        console.log("There is an error to delete unverified user",err)
    }
}


//Function To delete Older PDF files from CertificatePDf Folder 24 hours older file
const deletePDF= async()=>
{

    const pdfPath = path.join(process.cwd(), './public/CertificatePDF');

    fs.readdir(pdfPath, (err, files) => {
        if (err) {
            console.log(err)
        }
    
    
        files.forEach((file) => {
            const filePath = path.join(pdfPath, file);
    
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.log("There is an error in file statmment");
                }
    
                if (Date.now() - stats.mtimeMs > 24 * 60 * 60 * 1000) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log("There is an error in deleting the files", err);
                        }
                        console.log(`all the file deleted successfully from ${pdfPath} which is ${file}`);
                    })
                }
            })
        }
        )
    }
    );    
}

//Fuction For Backup of database

const BackupDB= ()=>
{
    const backupPath=path.join(process.cwd(),'/BackupDatabase/backup.json');
    userModel.find({}).
    then((user)=>
    {
        fs.writeFileSync(backupPath,JSON.stringify(user,null,2));
        console.log("Database Create Successfully");
    
    }
    )
    .catch((err)=>
    {
        console.log("There is an error in backuping of database",err);
    })

}



cron.schedule('*/10 * * * *',deleteExpiredOTPs);// Delete the OTP and OPTExpires field from the database  in every 10 minutes
cron.schedule('0 8 * * *',reminderEmail)//Every Day at 8 AM
cron.schedule('0 0 * * *',deletePDF)//Midnight Daily
cron.schedule('0 0 * * 0',BackupDB) //Backup every Sunday
cron.schedule('0 0 1 * *',unVerified) //will run at midnight 12 AM on the 1st day of Every Month
