const mongoose= require("mongoose")

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    role:{
        type:String,
        required: true,
        enum: ["customer","owner"],
        default: "customer"
    }
},
{
    timestamps: true
});

const User= mongoose.model("User",userSchema);
module.exports= User