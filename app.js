const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandling = require("./controller/ErrorController");
const app = express();
const querystring = require("querystring");

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["https://localhost:3000", "https://192.168.20.31:3000"],
  },
});
const { ExpressPeerServer } = require("peer");
const { default: axios } = require("axios");

// Serve static files from the public folder
app.use(express.static("public"));

// Create a PeerServer for peer-to-peer connections
const peerServer = ExpressPeerServer(http, {
  debug: true,
});

// Handle incoming connections to the PeerServer
peerServer.on("connection", (client) => {
  console.log("Peer connected:", client.getId());
  client.on("disconnect", () => {
    console.log("Peer disconnected:", client.getId());
    io.to("livestream").emit("user-disconnected", client.getId());
  });
  io.to("livestream").emit("user-connected", client.getId());
});

// Handle incoming connections to the socket.io server
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("join-room", (roomId, userId) => {
    console.log(`Socket joined room ${roomId}:`, socket.id);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });
  socket.on("disconnect", () => {});
});

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://quranhadith.netlify.app",
      "https://quranhadith.netlify.app/",
    ],
    credentials: true,
  })
);

app.use("/v1", routes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server❗❗`, 404));
});

app.use(globalErrorHandling);
module.exports = { app, http };
