import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Message from '../../../../models/Message';

// GET /api/messages - Return ONLY approved messages
export async function GET() {
  try {
    await connectDB();
    
    const messages = await Message.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .select('name message emoji createdAt');
    
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
    
    const { name, message, emoji } = await request.json();
    
    // Validation
    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }
    
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name cannot be more than 100 characters' },
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
      name: name.trim(),
      message: message.trim(),
      emoji: emoji?.trim() || '',
      status: 'pending'
    });
    
    await newMessage.save();
    
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