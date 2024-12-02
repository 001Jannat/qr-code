//database.js
import mongoose from "mongoose";

const connectDB = async () => {

    if(mongoose.connections[0].readyState) {
        return true;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
       console.log('MongoDB Connected');
       return true;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }   
}
    
      export default connectDB;
