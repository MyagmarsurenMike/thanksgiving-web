import { NextRequest, NextResponse } from "next/server";
import { auth, login } from "../../../../../lib/authenticator";
import connectDB from "../../../../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await auth();

    const { name, password } = await req.json();

    console.log(name, password);

    if (!name || !password) {
      return NextResponse.json({ error: "Name or password is not found" }, { status: 404 });
    }

    await login(name, password);
    return NextResponse.json("OK");
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}