import { Document, model, Schema } from "mongoose";

export const EXPIRES = 7 * 24 * 3600;

export interface ISession extends Document {
  token: string;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
}

const SessionSchema = new Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  createdAt: { type: Date, default: Date.now, expires: EXPIRES }
});

export default model<ISession>("Session", SessionSchema);
