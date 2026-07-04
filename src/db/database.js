import mongoose from "mongoose";


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // connecting to our database  
        console.log("✅ mongodb connected");
        
    } catch (error) {
        console.error("❌ mongodb connection error", error);
        process.exit(1) // return if there was error occcur
    }
}

export default connectDB;