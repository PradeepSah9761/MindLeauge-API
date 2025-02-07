import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const config=async()=>{

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection Succesfully");
    
} catch (error) {
    console.log("Connection Error",error);
    process.exit(1);
}


}
export default config;