import { NextRequest, NextResponse } from "next/server";
import { login } from "../../../../../lib/authenticator";
import connectDB from "../../../../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    // Remove auth() call - users shouldn't have a session when logging in

    const { name, password } = await req.json();

    console.log("Login attempt:", name);

    if (!name || !password) {
      return NextResponse.json({ error: "Name or password is required" }, { status: 400 });
    }

    await login(name, password);
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (e: any) {
    console.error("Login error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}