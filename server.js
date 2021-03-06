const express = require("express");
const path = require("path");
const socket = require("socket.io");
const messages = [];
const users = [];
const app = express();

app.use(express.static(path.join(__dirname, "/client")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/index.html"));
});
app.use((req, res) => {
  res.status(404).send("404 page not found...");
});

const server = app.listen(8000, () => {
  console.log("running on port: 8000");
});

const io = socket(server);

io.on("connection", (socket) => {
  console.log("New client! ID – " + socket.id);
  socket.on("message", () => {
    console.log("I recive something from " + socket.id);
  });

  socket.on("message", (message) => {
    console.log("I recive something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit("message", message);
  });

  socket.on("join", (username) => {
    console.log(" Add user ID: " + socket.id);
    users.push({ username, id: socket.id });
    console.log(users);
    socket.broadcast.emit("newUser", {
      author: "chatBot",
      content: `${username} has joined the conversation!`,
    });
  });

  socket.on("disconnect", (username) => {
    const leavingUser = users.find((user) => user.id == socket.id);
    const leavingUserIndex = users.indexOf(leavingUser);
    console.log(users);
    if (leavingUser) {
      socket.broadcast.emit("userLeft", {
        author: "chatBot",
        content: `${leavingUser.username} has left the conversation`,
      });
      users.splice(leavingUserIndex, 1);
    }
  });

  console.log("I am listening for new messages \n");
});
