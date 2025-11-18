import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Message from '../../../../../models/Message';
import { auth } from '../../../../../lib/authenticator';

// GET /api/admin/messages - Return ALL messages regardless of status
export async function GET() {
  try {
    await connectDB();
    await auth();
    
    const messages = await Message.find({})
      .sort({ createdAt: -1 });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching admin messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}