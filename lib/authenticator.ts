import { randomBytes } from "crypto";
import Admin from "../models/Admin";
import bcrypt from "bcrypt";
import Session,{ EXPIRES } from "../models/Session";
import { cookies } from "next/headers";

function generateSession() {
  return randomBytes(32).toString("hex");
}

export async function login(username: string, password: string) {
  const admin = await Admin.findOne({ name: username });
  if (!admin) throw new Error("Admin is null");
  console.log(admin);
  
  const match = await bcrypt.compare(password, admin.password);

  if (match) {
    const token = generateSession();
    const expiresAt = new Date(Date.now() + EXPIRES);
    (await cookies()).set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt
    });

    return await Session.insertOne({
      token,
      userId: admin.id,
    });
  }
  throw new Error("Password does not match");
}
export async function auth() {
  const cookie = (await cookies()).get("session");
  if (!cookie) throw new Error("Session cookie not found");

  const session = await Session.findOne({ token: cookie.value });
  if (!session) throw new Error("Session does not exist");
  return session;
}
export async function logout() {
  const session = await auth();

  (await cookies()).delete("session");
  await session.deleteOne();
}
