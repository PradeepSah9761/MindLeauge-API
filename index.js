import express from "express";

import connection from './Model/connection.js';
import manager_route from './Routes/route.js';



const PORT= process.env.PORT || 3000;

const app=express();
connection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/manager",manager_route);






app.listen( PORT,()=>
{
    console.log(`The server is runnig at port ${PORT}`);
})

