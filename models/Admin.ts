import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
    name: string;
    password: string;
}

const AdminSchema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Check if model already exists to prevent OverwriteModelError in development
export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);