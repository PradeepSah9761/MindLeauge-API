import jwt from 'jsonwebtoken';


const authJWT=(req,res,next)=>
{

    const token=req.header("Authorization");
    if(!token)
    {
       return res.status(401).json(
            {
                message:"please enter the token number as well for authentication,"
            }
        )
    }
    try
    {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
    }
    catch(err)
    {
       return  res.status(401).json(
           {
            message:"Invalid JWT token"
           }
        )
    }
}

export default authJWT;