import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "../models/Admin";
import bcrypt from "bcrypt";

dotenv.config({ path: '.env.local' });

const ADMIN_NAME = process.env.ADMIN_NAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const SALT_ROUNDS = 16;

if (!ADMIN_PASSWORD) throw new Error("Admin password not found!");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/thanksgiving_messages";

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to:", MONGODB_URI);

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    await Admin.insertOne({
      name: ADMIN_NAME,
      password: hashed,
    });
    console.log("Inserted admin succesfully.");
  } catch (e) {
    console.error("Error seeding database:", e);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
}

createAdmin();
