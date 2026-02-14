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
    socket.on("login", async (userId) => {
      socket.userId = userId; // ab socket object ke andar real user ki ID bhi stored hai, jo user connect hua uska socket ban gaya login kia uske socket object me userid field banakar user userid bhi dal di jissse aaram se pata chal jaye ki ye socket is user ko belong kar raha hai
      onlineUsers.set(userId, socket.id); //iska use hoga private messaging me

  // Find all messages that were sent to this user
  const undeliveredMessages = await Message.find({
    receiverId: userId,
    status: "sent"
  });
      await Message.updateMany({receiverId:userId,status:"sent"},{$set:{status:"delivered"}}) // all the messages sent to me become delivered when i logged in

  // Notify each sender
  const uniqueSenders = [
    ...new Set(undeliveredMessages.map(m => m.senderId.toString())) // jaise mujhe kisi teen logo ne message bheje kisi ne 4 message kisi ne 8 message kisi ne 1 message par sender to total teen hi hue,lekin undeliveredmessages me sare messages hai jisko agar map karoge to sare sender aayegenge jisme repeated sender bhi honge isliye set lagaya jisse jitne bhi repeated senderId hai bo hat jaye kebal unique rahe aur set lagane ka tareeka hi hai new set fir ... lagaya hai kyoki ye sar [] ke andar likha hai to jab sare unique sender aa jaye set ke andar to poore set ko kholkar bapas array me convert kardo
  ];

uniqueSenders.forEach((senderId)=>{
       const senderSocket= onlineUsers.get(senderId);//is senderId ke corresponding socket id nikal li kyoki message to uspr hi jayega na
       if(senderSocket){
        io.to(senderSocket).emit("message_delivered",{
          deliveredTo:userId
        })
       }
})

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
      try{
      // data = { senderId, receiverId, message }
      const receiverSocket = onlineUsers.get(data.receiverId); // it returns the socket id at the user id (data.receiverid)
      let status="sent"
      if(receiverSocket) status="delivered"
      const newMessage = await Message.create({...data,status});

      // send to receiver only if online
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", newMessage); // it is sent only to the aditya's browser, it will not go to my browser or my frontend, it will go and run into aditya's browser or frontend and in his browser senderid==user._id since message is sent from my side so senderid par maine apni id dali hui hai to uske chat.js me condition false ho jayegi or type=recieved aa jayega to recieve bubble ban jayega
      }

      // optional: echo back to sender too
      socket.emit("receive_message", newMessage); // it is sent only to my browser, my frontend will recieve it and check senderid==userid condition true kyoki maine hi message kara aur tab maine hi dala usme senderid=user._id , type=sent to sent bala bubble ban jaygea
    }catch(err){
      console.log('error during delivering is ',err);
    }
    });
    socket.on("mark_read",async({senderId,receiverId})=>{
      try{
        await Message.updateMany({senderId,receiverId,status:{$ne:"read"}},{$set:{status:"read"}}) //if status pahle se read nhi hai($ne not equal) tabhi status ko read karo
        const sendersocket=onlineUsers.get(senderId);
        if(sendersocket)
          io.to(sendersocket).emit("message_read",{ senderId: receiverId }) //maine chat kholi kisiki,usne mujhe message bheje the to sender to tha jiski maine chat kholi aur reciever mai khud tha to status update hone ke baad ab main jisne mujhe message bheje the usko forward karunga jisse ki ye request jaye uske browser par aur uske browser me run ho ske aur uske dwara bheje hue message jo ki delivered the ab bo blue hoke read ho jaye
      }catch(err){
        console.log('error during reading',err);
      }
    })
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


