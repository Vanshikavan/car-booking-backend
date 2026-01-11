const mongoose= require("mongoose")

const bookingSchema = new mongoose.Schema({
    car_name:{
        type:String,
        required: true
    },
  days:{
    type:Number,
    required:true
  },
  rent_per_day:{
    type: Number,
    required: true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
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