import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  interviewId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  score: number;
  verdict: string;
  overallImpression: string;
  breakdown: Array<{
    title: string;
    score: string;
    bullets: string[];
  }>;
  createdAt: Date;
}

const ReportSchema: Schema = new Schema({
  interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  score: { type: Number, required: true },
  verdict: { type: String, required: true },
  overallImpression: { type: String, required: true },
  breakdown: [
    {
      title: { type: String, required: true },
      score: { type: String, required: true },
      bullets: [{ type: String }],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReport>('Report', ReportSchema);
