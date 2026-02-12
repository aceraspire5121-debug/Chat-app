import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Jab hum Mongoose schema me likhte hain:
// { timestamps: true }
// to MongoDB automatically 2 fields add kar deta hai:

// createdAt
// updatedAt

//  name: "Sushant",
//   email: "sushant@test.com",
//   password: "hashedpass",
//   createdAt: "2026-02-07T10:30:00Z",
//   updatedAt: "2026-02-07T10:30:00Z"

const User = mongoose.model("User", userSchema);
export default User;

