import express from 'express';
import upload from '../upload.js';
import {manager_registration} from '../Controllers/TeamManagerController.js';

const manager_route=express.Router();

manager_route.post("/register",upload.single('logo'), manager_registration);


export default manager_route;