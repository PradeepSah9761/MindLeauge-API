import express from 'express';
import upload from '../upload.js';
import {manager_registration,StudentOrAlumni_registration} from '../Controllers/usersController.js';
import {checkUserType} from '../Middleware/typeAuthMiddleware.js';

const route=express.Router();

route.post("/manager/register",upload.single('logo'), manager_registration);
route.post("/:userType/register", checkUserType,StudentOrAlumni_registration);


export default route;