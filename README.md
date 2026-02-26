💬 NexChat – Real-Time Chat Application

NexChat is a modern full-stack real-time chat application built using Node.js, Express, MongoDB, and Socket.IO.
It enables secure private messaging, live user presence tracking, and persistent chat storage with a clean WhatsApp-style interface.

🌐 Live Demo

👉 https://your-render-link.onrender.com

🚀 Features

🔐 Secure User Authentication – JWT-based login & registration system

🔒 Password Encryption – bcrypt hashing for strong security

💬 Real-Time Messaging – Instant private chat using Socket.IO

🟢 Online / Offline Status – Live user presence tracking

🧑‍🤝‍🧑 Dynamic User List – Real-time active users update

📜 Persistent Chat History – Messages stored securely in MongoDB

⚡ Instant Message Delivery – No page refresh required

🔁 Auto Message Sync – Messages sync instantly between users

🎨 Modern Responsive UI – Clean WhatsApp-style interface using Tailwind CSS

📱 Mobile-Friendly Design – Smooth performance on all screen sizes

🔄 Live Socket Mapping – userId → socketId mapping for private messaging

🔐 Protected API Routes – Secure backend endpoints using JWT middleware

🚀 Production Deployment – Hosted on Render with MongoDB Atlas

👥 Multi-User Architecture

Each user can access only their own conversations

Messages are securely linked to authenticated user accounts

Unauthorized access redirects to login

Multiple users can chat simultaneously without data overlap

🧭 Application Flow
🔹 Authentication Flow

User registers or logs in

Server generates JWT token

Token is used to authorize protected API routes

🔹 Real-Time Communication Flow

Socket.IO establishes a persistent connection

userId is mapped to socketId

Messages are delivered instantly to the target user

Online status updates in real time

🔹 Data Persistence

Messages are stored in MongoDB

Chat history loads automatically when users reconnect

🛠 Tech Stack

Frontend
HTML, Tailwind CSS, JavaScript, Socket.IO Client

Backend
Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt

Deployment
Render (Backend Hosting)
MongoDB Atlas (Cloud Database)

No local setup required. Open the link and start chatting.

🔒 Security Implementation

Password hashing using bcrypt

JWT token-based authentication

Middleware-protected API routes

User-specific message access control

Secure socket-to-user mapping

🔮 Future Enhancements

👥 Group Chat Support

📎 Media & File Sharing

🔔 Message Notifications

✔ Read Receipts

🗑 Message Delete / Edit Option

🎥 Voice & Video Calling Integration

👨‍💻 Author

Sushant Yadav
B.Tech Student | Full Stack Developer

GitHub: https://github.com/aceraspire5121-debug
