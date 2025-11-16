import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  message: string;
  emoji?: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const MessageSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
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

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);