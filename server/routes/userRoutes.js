import express from "express"
import jwt from "jsonwebtoken"; 
import { registerUser,loginUser } from "../controllers/userController.js"
import { getAllUsers } from "../controllers/userController.js";
const router = express.Router();
import Message from "../models/message.js";

function auth(req, res, next) {
  const authHeader = req.headers["authorization"]; // since node/express lowercase them internally and http servers are case sensitive so we have habe to use small authorization instead of Authorization
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1]; // split "Bearer <token>" -> take token
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach user ID to request
    next(); // proceed to route
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}


router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/all", getAllUsers);
router.get("/:userid",auth,async (req,res)=>{
const receiverId=req.params.userid; //params is a object in which slugs used get stored
const senderId=req.userId;
try{
const data=await Message.find({
    $or:[ //jab do condition deni ho jisme se ek hi chale to mongodb me aise dete hai
        {senderId:senderId,receiverId:receiverId},
        {senderId:receiverId,receiverId:senderId}
    ]
}).sort({createdAt:1}) // 1 doge to oldest to newest , -1 doge to newest to oldest
res.json(data)
}catch(err){
    console.log('error at time of message fetching is',err);
res.status(500).json({ message: "Server error" });
}
})

export default router;