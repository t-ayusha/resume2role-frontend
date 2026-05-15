import mongoose, { Schema, Document } from 'mongoose';

export interface IPrepQuestion extends Document {
  title: string;
  filePath: string;
  className: string;
  description?: string;
  adminId: string;
  createdAt: Date;
}

const PrepQuestionSchema: Schema = new Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 120 },
  filePath: { type: String, required: true },
  className: { type: String, required: true },
  description: { type: String, maxlength: 500 },
  adminId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPrepQuestion>('PrepQuestion', PrepQuestionSchema);
