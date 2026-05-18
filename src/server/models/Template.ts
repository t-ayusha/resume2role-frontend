import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  title: string;
  description: string;
  role: string;
  type: string;
  icon?: string;
}

const TemplateSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  role: { type: String, required: true },
  type: { type: String, required: true },
  icon: { type: String },
});

export default mongoose.model<ITemplate>('Template', TemplateSchema);
