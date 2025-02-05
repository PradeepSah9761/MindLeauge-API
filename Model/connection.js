import mongoose from 'mongoose';
const URL="mongodb+srv://pradeep:pradeepsahdb@cluster0.yngar.mongodb.net/TeamManager?retryWrites=true&w=majority&appName=Cluster0"
const connection=async()=>{

try {
    await mongoose.connect(URL);
    console.log("Connection Succesfully");
    
} catch (error) {
    console.log("Connection Error",error);
    process.exit(1);
}


}
export default connection;