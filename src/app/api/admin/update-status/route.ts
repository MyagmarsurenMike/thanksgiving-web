import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Message from '../../../../../models/Message';
import { auth } from '../../../../../lib/authenticator';
import { emitMessageRefresh } from '../../../../../lib/socket';

// PATCH /api/admin/update-status - Approve or reject a message
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    await auth();
    
    const { messageId, status } = await request.json();
    
    // Validation
    if (!messageId || !status) {
      return NextResponse.json(
        { error: 'Message ID and status are required' },
        { status: 400 }
      );
    }
    
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "approved" or "rejected"' },
        { status: 400 }
      );
    }
    
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );
    
    if (!updatedMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    emitMessageRefresh();
    
    return NextResponse.json({
      message: `Message ${status} successfully`,
      data: updatedMessage
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    return NextResponse.json(
      { error: 'Failed to update message status' },
      { status: 500 }
    );
  }
}