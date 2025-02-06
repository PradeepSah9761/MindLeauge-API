import{ StudentAndAlumniModel}  from "../Model/StudentAndAlumniModel.js";


// Middleware to check userType

const validUserTypes=StudentAndAlumniModel.schema.path('userType').enumValues;


const checkUserType = (req, res, next) => {
  const { userType } = req.params;
  
  if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }
    
    next();
};


export {checkUserType};