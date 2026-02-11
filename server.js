const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(express.static("public"));

const server = http.createServer(app);

const io = new Server(server, {
  cors : { origin : "*" }
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("join", (username) => {
    onlineUsers[socket.id] = username; //Stores the username ka id

    io.emit("onlineUsers", Object.values(onlineUsers));

    io.emit("message", {user: "SYSTEM", text: `${username} joined the chat`});
  })

  socket.on("sendMessage", (data) => {
    io.emit("message", data)
  })

  socket.on("disconnect", () => {
    const username = onlineUsers[socket.id];
    delete onlineUsers[socket.id];

    io.emit("onlineUsers", Object.values(onlineUsers));

    if(username) {
      io.emit("message", {user: "SYSTEM", text: `${username} left the chat`});

    }

    
  })
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});