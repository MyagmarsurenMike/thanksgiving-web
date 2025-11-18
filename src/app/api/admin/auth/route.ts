import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../lib/authenticator";
import connectDB from "../../../../../lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await auth();
    return NextResponse.json("OK");
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
