const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const userRouter = require("./routes/userRoutes")
const messageRouter=require("./routes/messagesRoutes")

const app=express()
const socket=require("socket.io")
require("dotenv").config()

app.use(cors())
app.use(express.json());

app.use("/api/auth/",userRouter)
app.use("/api/messages/",messageRouter)

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("DB connected!!")
})
.catch((err)=>{
    console.log(err.message)
})


const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`);
})

const io=socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials:true,
    },
});

global.onlineUsers=new Map();

io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id)
    })
    socket.on("send-msg",(data)=>{
        const sendUserSocket=onlineUsers.get(data.to);
        if (sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.msg)
        }
    })
})

