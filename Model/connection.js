import mongoose from 'mongoose';

const config=async()=>{

try {
    await mongoose.connect(process.env.MONGO_URI,{
        connectTimeoutMS:30000,
        socketTimeoutMS:30000
    });
    console.log("Connection Succesfully");
    
} catch (error) {
    console.log("Connection Error",error);
    process.exit(1);
}


}
export  default config;