import express from "express";
// const express=require('express');

import dotenv from 'dotenv';
// const dotenv =require('dotenv');
import path from 'path';
// const path =require('path');

import ejs from 'ejs';
// const ejs =require('ejs');

import config from './Model/connection.js';
// const config=require('./Model/connection');
import route from './Routes/route.js';
// const route =require('./Routes/route');
        const __dirname = path.dirname(new URL(import.meta.url).pathname); // ES module fix for __dirname

dotenv.config();
const PORT= process.env.PORT || 3000;

const app=express();
config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine','ejs');

// app.use(express.static('public'));
app.set('views',path.join(process.cwd(),"views"));
app.use("/api/",route);

app.listen( PORT,()=>
{
    console.log(`The server is runnig at port ${PORT}`);
})

