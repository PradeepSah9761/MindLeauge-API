import express from 'express';
import upload from '../upload.js';
import authJWT from '../Middleware/authMiddleware.js';
const app=express();
app.use(upload.none());

import {user_registration,addNewCoach, verifyOTP, forgetPassword,resetPassword, loginViaPassword, resendOTP,generatePDF, downloadPDF} from '../Controllers/usersController.js';
import {checkUserType} from '../Middleware/typeAuthMiddleware.js';

const route=express.Router();

route.post("/:userType/register",upload.single('logo'), checkUserType,user_registration);
route.post("/:userType/added",upload.single('logo'),checkUserType,addNewCoach );
route.post("/verify-otp",verifyOTP);
route.post("/forget-password",authJWT,forgetPassword);
route.post("/reset-password",authJWT,resetPassword);
route.post("/login-password",loginViaPassword);
route.post("/resend-otp",resendOTP);
route.get("/generate-pdf/:fullName/:schoolName",generatePDF);
route.get("/download-pdf/:filename",downloadPDF);




export default route;