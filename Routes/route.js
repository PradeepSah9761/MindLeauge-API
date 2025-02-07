import express from 'express';
import upload from '../upload.js';
const app=express();
app.use(upload.none());

import {user_registration,addNewCoach, verifyOTP,loginViaOTP, forgetPassword,resetPassword, loginViaPassword} from '../Controllers/usersController.js';
import {checkUserType} from '../Middleware/typeAuthMiddleware.js';

const route=express.Router();

route.post("/:userType/register",upload.single('logo'), checkUserType,user_registration);
route.post("/:userType/added",upload.single('logo'),checkUserType,addNewCoach );
route.post("/login-otp",loginViaOTP);
route.post("/verify-otp",verifyOTP);
route.post("/forget-password",forgetPassword);
route.post("/reset-password",resetPassword);
route.post("/login-password",loginViaPassword);



export default route;