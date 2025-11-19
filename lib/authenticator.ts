import { randomBytes } from "crypto";
import Admin from "../models/Admin";
import bcrypt from "bcrypt";
import Session, { EXPIRES } from "../models/Session";
import { cookies } from "next/headers";

function generateSession() {
  return randomBytes(32).toString("hex");
}

export async function login(username: string, password: string) {
  const admin = await Admin.findOne({ name: username });
  if (!admin) throw new Error("Admin not found");
  console.log("Found admin:", admin.name);
  
  const match = await bcrypt.compare(password, admin.password);

  if (match) {
    const token = generateSession();
    const expiresAt = new Date(Date.now() + EXPIRES * 1000); // Convert seconds to milliseconds
    
    // Set the session cookie
    (await cookies()).set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      expires: expiresAt
    });

    // Create session in database using Mongoose (MongoDB will auto-expire based on createdAt + EXPIRES)
    const session = await Session.create({
      token,
      userId: admin._id
    });
    
    console.log("Session created:", session.token);
    return session;
  }
  throw new Error("Password does not match");
}

export async function auth() {
  const cookie = (await cookies()).get("session");
  if (!cookie) throw new Error("Session cookie not found");

  const session = await Session.findOne({ token: cookie.value });
  if (!session) throw new Error("Session does not exist or has expired");
  
  return session;
}

export async function logout() {
  const cookie = (await cookies()).get("session");
  if (!cookie) return;

  // Delete session from database
  await Session.deleteOne({ token: cookie.value });
  
  // Delete session cookie
  (await cookies()).delete("session");
}
