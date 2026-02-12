import express from "express"
import cors from "cors";
import http from "http";            // Node HTTP server
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js"
import Message  from "./models/message.js"
import { initSocket } from "./socket/index.js"; // new import
import path from 'path';
import { fileURLToPath } from 'url';
// Needed to use __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
console.log("hii")
const app = express()
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());
dotenv.config()
app.use(cors());    //ok if i choose port 3000 then i dont need cors but i am choosing port 5000 so i need to use cors in order to allow request from different ports since frontend runs on local computer on port 3000 so to allow request from 3000 to 5000 we needs cors
app.use("/api/users", userRoutes);
app.use("/api/messages",userRoutes);
const port = process.env.PORT || 5000;
const MONGO_URL=process.env.MONGO_URL
const connectDB=async ()=>{
    try{
    await mongoose.connect(MONGO_URL)
    console.log("MongoDB connected")
    }catch(err)
    {
        console.log(err);
        process.exit(1);
    }
}
connectDB();
// ⚡ Wrap Express app in HTTP server for Socket.IO
const server = http.createServer(app);
// ⚡ Initialize Socket.IO
// ⚡ Initialize Socket.IO (modular)
const io = initSocket(server);

// app.get('/hlo', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/login.html'))
// })
 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// 1. Express Kya Hai?

// Express server nahi hota.

// Express ek request handler / framework hai.

// Express ka kaam:

// Routes handle karna

// Middleware chalana

// Response dena


// Express network connection accept nahi karta.



// ---

// 2. Real Server Kaun Hota Hai?

// Node.js ka HTTP / HTTPS server hi actual server hota hai.

// Ye server:

// Port open karta hai

// Browser se connection accept karta hai

// Connection ko maintain karta hai



// 👉 Real networking ka kaam HTTP/HTTPS server karta hai, Express nahi.


// ---

// 3. app.listen() Actually Kya Karta Hai?

// Jab hum likhte hain:

// app.listen(3000);

// Under the hood Node.js ye karta hai:

// const server = http.createServer(app);
// server.listen(3000);

// Important Point:

// Server ban jata hai ✅

// Express us server par chal jata hai ✅

// Lekin us server ka reference hume nahi milta ❌


// Iska matlab:

// Express APIs kaam karti hain

// Par hum us server pe aur cheezein attach nahi kar sakte



// ---

// 4. Socket.io Ko Kya Chahiye?

// Socket.io ko chahiye:

// > Actual HTTP/HTTPS server ka object



// Kyun?

// Kyunki socket.io ko browser ke saath

// long-lived / real-time connection banana hota hai

// Ye kaam Express nahi karta

// Ye kaam server karta hai



// ---

// 5. Problem Kahan Aati Hai?

// Agar hum sirf:

// app.listen(3000);

// use karein to:

// Server Express ke paas hota hai

// Socket.io ke paas server ka access nahi hota

// Isliye socket.io properly attach nahi ho paata



// ---

// 6. Solution: Express Ko Server Me Wrap Karna

// Isliye hum khud server banate hain:

// const server = http.createServer(app);

// Iska matlab:

// Server humne khud banaya

// Express ko us server par pass kiya

// Ab server ka full control humare paas hai



// ---

// 7. Ab Socket.io Ko Server Dete Hain

// const io = new Server(server);

// Ab:

// Express → HTTP requests handle karta hai

// Socket.io → real-time connections handle karta hai

// Dono same server aur same port pe chal rahe hain


// 👉 Ye industry-standard architecture hai.


// ---

// Socket.io ko Express nahi chahiye,
// socket.io ko us server ka control chahiye jisme Express chal raha ho.

// Kya sirf Express se socket.io kaam kar sakta hai bina HTTP server ke?

// Nahi, kar sakta.
// Kyunki socket.io ko ek real HTTP server chahiye hota hai.
// Express khud Node ke HTTP server par chalta hai, lekin jab hum app.listen() use karte hain,
// to us server ka reference hume nahi milta.
// Isliye hum http.createServer(app) banate hain,
// usme Express pass karte hain,
// aur wahi server socket.io ko de dete hain.
// Ab socket.io ke paas real server hota hai,
// jiske through wo browser–server ke beech real-time connection bana sakta hai.