const express=require("express")
const app=express()
const http=require("http")
const server=http.createServer(app)
require("dotenv").config()
const socketio=require("socket.io")
const path=require("path")

const io=socketio(server)

app.use(express.static(path.join(__dirname, "public" )))
app.set("view engine", "views")
app.set("views","ejs")

io.on("connection",(socket)=>{
    console.log(socket.id)
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{id:socket.id,data})
    })
    socket.on("disconnect",()=>{
        io.emit("user-disconnect",socket.id)
    })
})

app.get("/",async (req,res)=>{
    return res.status(200).render(path.join(__dirname,"views","index.ejs"));
})


server.listen(3000,()=>{
    console.log("listening on port")
})
