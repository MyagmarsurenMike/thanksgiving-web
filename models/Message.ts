import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  fromName: string;
  toName: string;
  message: string;
  emoji?: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const MessageSchema: Schema = new Schema({
  fromName: {
    type: String,
    required: [true, 'From name is required'],
    trim: true,
    maxlength: [100, 'From name cannot be more than 100 characters']
  },
  toName: {
    type: String,
    required: [true, 'To name is required'],
    trim: true,
    maxlength: [100, 'To name cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  emoji: {
    type: String,
    trim: true,
    maxlength: [10, 'Emoji cannot be more than 10 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

// Delete existing model to prevent OverwriteModelError
if (mongoose.models.Message) {
  delete mongoose.models.Message;
}

export default mongoose.model<IMessage>('Message', MessageSchema);