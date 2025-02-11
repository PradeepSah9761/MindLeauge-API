import express from "express";

import dotenv from 'dotenv';
import path from 'path';


import config from './Model/connection.js';
import route from './Routes/route.js';
 const __dirname = path.dirname(new URL(import.meta.url).pathname); // ES module fix for __dirname

dotenv.config();
const PORT= process.env.PORT || 3000;

const app=express();
config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine','ejs');

// app.use(express.static('public'));
app.set('views',path.join(__dirname,"views"));
app.use("/api/",route);

app.listen( PORT,()=>
{
    console.log(`The server is runnig at port ${PORT}`);
})

