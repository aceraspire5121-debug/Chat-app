import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // for private chat
  message: { type: String, required: true },
    status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent"
  },
  createdAt: { type: Date, default: Date.now }
});

// mongoose.Schema.Types.ObjectId, it refers to the objectid which each document stored in mongodb contains

 const Message = mongoose.model("Message", messageSchema);
 export default Message;
