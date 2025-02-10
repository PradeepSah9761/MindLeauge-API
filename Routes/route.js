import express from 'express';
// const express = require('express');
import upload from '../upload.js';
// const upload =require('../upload.js');
const app=express();
app.use(upload.none());

import {user_registration,addNewCoach, verifyOTP, forgetPassword,resetPassword, loginViaPassword} from '../Controllers/usersController.js';
import {checkUserType} from '../Middleware/typeAuthMiddleware.js';
import {sendEmail} from '../Services/mailService.js';

const route=express.Router();

route.post("/:userType/register",upload.single('logo'), checkUserType,user_registration);
route.post("/:userType/added",upload.single('logo'),checkUserType,addNewCoach );
route.post("/send-email",sendEmail);
route.post("/verify-otp",verifyOTP);
route.post("/forget-password",forgetPassword);
route.post("/reset-password",resetPassword);
route.post("/login-password",loginViaPassword);




export default route;