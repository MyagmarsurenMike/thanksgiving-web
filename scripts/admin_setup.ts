import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "../models/Admin";
import bcrypt from "bcrypt";

if (require.main === module) {
  dotenv.config({ path: '.env.local' });
}

const ADMIN_NAME = "admin";
const ADMIN_PASSWORD = "thanksgiving2024";
const SALT_ROUNDS = 16;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/thanksgiving_messages";

async function createAdmin() {
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  if (await Admin.exists({ name: ADMIN_NAME })) {
    console.log("Admin already exists.");
    return;
  }

  await Admin.insertOne({
    name: ADMIN_NAME,
    password: hashed,
  });
  console.log("Inserted admin succesfully.");
}

if (require.main === module) {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to:", MONGODB_URI);
  createAdmin();
  await mongoose.disconnect();
  console.log("Disconnected");
}

export default createAdmin;
