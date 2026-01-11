const mongoose=require("mongoose");

const connectDb = async()=>{
    try{
        const connection=await mongoose.connect(MONGO_URI);
            console.log("Connected to db");
    }catch(error){
        console.log("Connection failed",error);
        process.exit(1)
    }
}

module.exports(connectDb)