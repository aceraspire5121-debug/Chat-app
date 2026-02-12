import { Server } from "socket.io";
import Message from "../models/message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials:true
    },
  });

    // Map to track online users: { userId => socketId }
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id); 

    
    // User login / identify
    socket.on("login", (userId) => {
      socket.userId = userId; // ab socket object ke andar real user ki ID bhi stored hai, jo user connect hua uska socket ban gaya login kia uske socket object me userid field banakar user userid bhi dal di jissse aaram se pata chal jaye ki ye socket is user ko belong kar raha hai
      onlineUsers.set(userId, socket.id); //iska use hoga private messaging me
      console.log("Online Users:", Array.from(onlineUsers.keys()));
      io.emit("online_users", Array.from(onlineUsers.keys())); // io.emit() sab connected users ko data bhejta hai.
    });

example:-

//     New socket connected: H9f8g7h6i5j4
// Socket object: Socket {
//   id: 'H9f8g7h6i5j4',
//   userId: '64ff123456789abcdef12345',
//   ...
// }
// Online Users Map: [ [ '64ff123456789abcdef12345', 'H9f8g7h6i5j4' ] ]

    // Private messages
    socket.on("send_message", async (data) => {
      // data = { senderId, receiverId, message }
      const newMessage = await Message.create(data);

      // send to receiver only if online
      const receiverSocket = onlineUsers.get(data.receiverId); // it returns the socket id at the user id (data.receiverid)
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", newMessage); // it is sent only to the aditya's browser, it will not go to my browser or my frontend, it will go and run into aditya's browser or frontend and in his browser senderid==user._id since message is sent from my side so senderid par maine apni id dali hui hai to uske chat.js me condition false ho jayegi or type=recieved aa jayega to recieve bubble ban jayega
      }

      // optional: echo back to sender too
      socket.emit("receive_message", newMessage); // it is sent only to my browser, my frontend will recieve it and check senderid==userid condition true kyoki maine hi message kara aur tab maine hi dala usme senderid=user._id , type=sent to sent bala bubble ban jaygea
    });
    // Optional: handle disconnect
    socket.on("disconnect", () => {
  if (socket.userId) { // maine tab close kari,disconnect bala chala iske andar aaya since socket.userid exist karti hai,condition true andar jayega fir delete kar dega onlineuser map se usko fir message print kar dega, ye disconnect event handler chalne ke baad ab hamara socket bhi destroy ho jayega 
    onlineUsers.delete(socket.userId);
    console.log("User disconnected:", socket.id, "=> removed from onlineUsers");
    io.emit("online_users", Array.from(onlineUsers.keys()));
  }
});
  });

  return io;
};

// io means all users
// socket means single users
// io.on("connected") means a user connects hence its socket is created , io is listening to all 
// socket.on("disconnect") means it is listening to all if any user disconnect its socket get destroyed


