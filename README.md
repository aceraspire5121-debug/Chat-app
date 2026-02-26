# 💬 NexChat – Real-Time Chat Application

A modern **full-stack real-time chat web application** that enables secure private messaging, live user tracking, and persistent chat history using a scalable backend architecture.

---

## 🌐 Live Demo

The application is deployed on **Render** and accessible directly from the browser:

👉 **https://chat-app-7wk4.onrender.com/**

_No local setup required. Just open the link and start chatting._

---

## 🚀 Features

- ✅ Secure user authentication (JWT-based login & registration)
- ✅ Encrypted password storage using bcrypt
- ✅ Real-time private messaging with Socket.IO
- ✅ Online / Offline user status indicator
- ✅ Dynamic active user list
- ✅ Persistent chat history (MongoDB)
- ✅ Instant message delivery (no refresh required)
- ✅ Auto message synchronization between users
- ✅ Live userId → socketId mapping
- ✅ Protected backend API routes
- ✅ Responsive WhatsApp-style modern UI (Tailwind CSS)
- ✅ Mobile-friendly design
- ✅ Production deployment on Render + MongoDB Atlas

---

## 👥 Multi-User Functionality

- Each user can access **only their own conversations**
- Messages are securely linked to authenticated user accounts
- Unauthorized access redirects users to the login page
- Multiple users can chat simultaneously without data overlap

---

## 🧭 Application Workflow

### 🔹 Authentication Flow
- User registers or logs in
- Server generates JWT token
- Token secures protected API routes

### 🔹 Real-Time Communication
- Socket.IO establishes persistent connection
- userId maps to socketId
- Messages are delivered instantly
- Online status updates in real time

### 🔹 Data Persistence
- Messages are stored securely in MongoDB
- Chat history loads automatically on login
- Cloud database hosted on MongoDB Atlas

---

## 🛠 Tech Stack

**Frontend**
- HTML
- Tailwind CSS
- JavaScript
- Socket.IO Client

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt

**Deployment**
- Render
- MongoDB Atlas

---

## 🔒 Security Highlights

- Password hashing using bcrypt
- JWT-based authentication system
- Middleware-protected API routes
- User-specific message access control
- Secure real-time socket mapping

---

## 🔮 Future Enhancements

- Group chat functionality
- Media & file sharing
- Message edit/delete option
- Notifications system
- Read receipts
- Voice & video calling integration

---

## 👨‍💻 Author

**Sushant Yadav**  
B.Tech Student | Full Stack Developer  

---
