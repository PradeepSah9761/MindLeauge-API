import express from "express";

import config from './Model/connection.js';
import route from './Routes/route.js';



const PORT= process.env.PORT || 3000;

const app=express();
config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/",route);






app.listen( PORT,()=>
{
    console.log(`The server is runnig at port ${PORT}`);
})

