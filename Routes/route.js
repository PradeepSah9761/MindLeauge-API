import express from 'express';
import upload from '../upload.js';
const app=express();
app.use(upload.none());

import {user_registration,addNewCoach} from '../Controllers/usersController.js';
import {checkUserType} from '../Middleware/typeAuthMiddleware.js';

const route=express.Router();

// route.post("/manager/register",upload.single('logo'), user_registration);
route.post("/:userType/register",upload.single('logo'), checkUserType,user_registration);
route.post("/:userType/added",upload.single('logo'),checkUserType,addNewCoach );


export default route;