const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
dotenv.config("./.env")
const connection = require("./db/db.js");
const userrouter = require("./Routes/userroutes")
const messagerouter = require("./Routes/messageroutes")
const chatrouter = require("./Routes/chatroutes")
const app = express();
const corsoptions = { credentials: true, origin: true }
const path = require("path")
const PORT = process.env.PORT || 5000

app.use(cors(corsoptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use("/api/users", userrouter);
app.use("/api/chats", chatrouter);
app.use("/api/messages", messagerouter);
connection();
if( process.env.NODE_ENV === 'production'){
app.use(express.static(path.resolve('client/build')));
app.use(express.static('public'));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve (__dirname,"client","build","index.html"))
})
}


const server = app.listen(PORT, () => { console.log("listening on port 5000"); })
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

io.on("connection", (socket) => {
  socket.on("setup", (userId) => {
    socket.join(userId)
  })

  socket.on("joinchat", (chatId) => {
    console.log("----------------------------------------------------------------");
    console.log("join chat");
    socket.join(chatId)
  })

  socket.on("sendMessage", (message) => {
    message.chat.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("recievedMessage", message)
    });
  })

  socket.off("setup", (userId) => {
    console.log("USER DISCONNECTED");
    socket.leave(userId);
  });

})