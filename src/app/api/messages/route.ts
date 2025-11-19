import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Message from '../../../../models/Message';
import { emitMessageRefresh } from '../../../../lib/socket';

// GET /api/messages - Return ONLY approved messages
export async function GET() {
  try {
    await connectDB();
    
    const messages = await Message.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .select('fromName toName message emoji createdAt');
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create a new message with status="pending"
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { fromName, toName, message, emoji } = await request.json();
    
    // Validation
    if (!fromName || !toName || !message) {
      return NextResponse.json(
        { error: 'From name, to name and message are required' },
        { status: 400 }
      );
    }
    
    if (fromName.length > 100) {
      return NextResponse.json(
        { error: 'From name cannot be more than 100 characters' },
        { status: 400 }
      );
    }

    if (toName.length > 100) {
      return NextResponse.json(
        { error: 'To name cannot be more than 100 characters' },
        { status: 400 }
      );
    }
    
    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message cannot be more than 500 characters' },
        { status: 400 }
      );
    }
    
    const newMessage = new Message({
      fromName: fromName.trim(),
      toName: toName.trim(),
      message: message.trim(),
      emoji: emoji?.trim() || '',
      status: 'pending'
    });
    
    await newMessage.save();
    emitMessageRefresh();
    
    return NextResponse.json(
      { message: 'Message submitted successfully and is pending approval' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    );
  }
}