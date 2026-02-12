// import { io } from "socket.io-client";

// // Connect to server
// const socket = io("http://localhost:5000"); // ya jo bhi tumhara backend port ho

// // User login
// const userId = "64ff123456789abcdef12345"; // MongoDB user ID
// socket.emit("login", userId);

// // Listen for messages
// socket.on("receive_message", (msg) => {
//   console.log("New message received:", msg);
// });

// // Send a message after 2 seconds
// setTimeout(() => {
//   const messageData = {
//     senderId: userId,
//     receiverId: "64ff123456789abcdef67890", // receiver MongoDB user ID
//     message: "Hello from test client!",
//   };
//   socket.emit("send_message", messageData);
// }, 2000);
