const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Serve files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

const players = {}; // Store connected players

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Handle player actions
  socket.on("playerMove", (data) => {
    players[socket.id] = data; // Store or update the player's position
    socket.broadcast.emit("playerMove", { ...data, id: socket.id });
  });

  socket.on("bulletFired", (bulletData) => {
    socket.broadcast.emit("bulletFired", bulletData);
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id]; // Remove the player from the list
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
