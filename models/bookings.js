const mongoose= require("mongoose")

const bookingSchema = new mongoose.Schema({
    carName:{
        type:String,
        required: true
    },
  days:{
    type:Number,
    required:true
  },
  rentPerDay:{
    type: Number,
    required: true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  status:{
    type:String,
    enum:["booked","completed","cancelled"],
    default:"booked",
    required:true,
  }
},
{
    timestamps: true
})

const Booking= mongoose.model("Booking",bookingSchema);
module.exports=Booking;