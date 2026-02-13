import User from "../models/user.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser= async (req,res)=>{
    
try{
    const {name,email,password}=req.body

   // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const UserExist=await User.findOne({email})
    if(UserExist)
         return res.json({success:false,message:"User already exists"})
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=await User.create({name,email,password:hashedPassword})
    return res.json({success:true,message:"Account successfully created"})
}catch(err)
{
    console.log("error is",err)
    res.status(500).json({message:"Server error"})
}
}

export const loginUser=async (req,res)=>{
    try{
    const {email,password}=req.body
    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const UserExist=await User.findOne({email})
    if(!UserExist)
        return res.json({success:false,message:"Account not found"})
    const pass=await bcrypt.compare(password,UserExist.password)
    if(!pass)
        return res.json({success:false,message:"Password is wrong"})
     const token = jwt.sign({ id: UserExist._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
     res.json({success:true,token,UserExist:{
         _id: UserExist._id,
    name: UserExist.name,
    email: UserExist.email
     }})
}catch(err)
{
    console.log(err)
    res.status(500).json("Server Error")
}

}

export const getAllUsers=async (req,res)=>{
 try{
    const users = await User.find().select("-password"); // all users but without password
    res.json(users)
 }catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}