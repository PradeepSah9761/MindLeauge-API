import{userModel}  from "../Model/registerModel.js";
import path from 'path';


// Middleware to check userType

const validUserTypes=userModel.schema.path('userType').enumValues;


const checkUserType = (req, res, next) => {
  const { userType } = req.params;
  
  if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }
    
    next();
};


export {checkUserType};