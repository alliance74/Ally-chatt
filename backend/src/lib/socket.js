
// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//   },
// });

// const userSocketMap = {}; // { userId: socketId }

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) userSocketMap[userId] = socket.id;

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };



import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Adjust based on your frontend URL
  },
});

const userSocketMap = {}; // Map of userId to socketId

// Function to get the socketId for a specific user
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// When a client connects to the server
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Assuming the userId is passed in the handshake query
  const userId = socket.handshake.query.userId;  // E.g., ?userId=123
  if (userId) {
    userSocketMap[userId] = socket.id; // Store the userId with the socketId
  }

  // Broadcast online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for disconnection event
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    // Remove the userId from the map when they disconnect
    delete userSocketMap[userId];
    // Broadcast updated online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Example event for sending a message (you can replace this with your real message event)
  socket.on("sendMessage", (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    if (receiverSocketId) {
      // Emit a notification to the receiver
      io.to(receiverSocketId).emit("newNotification", { message: "You have a new message!" });
    } else {
      console.log("Receiver is not online.");
    }
  });
});

export { io, app, server };
