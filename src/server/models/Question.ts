import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  interviewId: mongoose.Types.ObjectId;
  text: string;
  category?: string;
  order: number;
}

const QuestionSchema: Schema = new Schema({
  interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', required: true, index: true },
  text: { type: String, required: true },
  category: { type: String },
  order: { type: Number, required: true },
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);
