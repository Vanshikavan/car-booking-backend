const express= require("express")
const connectDb= require("./config/db.js")
const user =require("./routes/user.js")

const app= express();

app.use(cors({}))
app.use(express.json())

app.get("/test",(req,res)=>{
    res.json("Running")
});

app.use("/api/user",user)

// connectDb();
app.listen(3000,()=>{
    console.log("Server listening on port 3000");
})
