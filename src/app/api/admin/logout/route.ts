import { NextRequest, NextResponse } from "next/server";
import { logout } from "../../../../../lib/authenticator";
import connectDB from "../../../../../lib/mongodb";

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    await logout();
    return NextResponse.json("OK");
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
