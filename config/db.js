import mongoose from "mongoose";
import colors from 'colors'
//morgan is use to show the api on the console
const connectDB=async ()=>{
        try{
            const conn=await mongoose.connect(process.env.MONGO_URL)
            console.log( `${conn.connection.host} database connected`.bgGreen.white)
        }catch(err){
            console.log(`Error in the Mongodb ${err}`.bgRed.white)
        }
}

export default connectDB;