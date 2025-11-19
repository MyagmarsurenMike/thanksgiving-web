import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Message from '../../../../../models/Message';
import { emitMessageRefresh } from '../../../../../lib/socket';

// DELETE /api/admin/delete - Delete a message permanently
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { messageId } = await request.json();
    
    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
    
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    
    if (!deletedMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    emitMessageRefresh();
    
    return NextResponse.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}