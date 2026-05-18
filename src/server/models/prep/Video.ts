import mongoose, { Schema, Document } from 'mongoose';

export interface IPrepVideo extends Document {
  title: string;
  youtubeLink: string;
  className: string;
  coverImage: string;
  adminId: string;
  createdAt: Date;
}

const PrepVideoSchema: Schema = new Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 120 },
  youtubeLink: { type: String, required: true },
  className: { type: String, required: true },
  coverImage: { type: String, required: true },
  adminId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPrepVideo>('PrepVideo', PrepVideoSchema);
