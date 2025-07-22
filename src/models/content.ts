import mongoose, { Document, Model } from "mongoose";

export interface IContent extends Document {
  header: string;
  subheader: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const contentSchema = new mongoose.Schema<IContent>(
  {
    header: { type: String, required: true },
    subheader: { type: String, required: true },
  },
  { timestamps: true }
);

const Content: Model<IContent> =
  mongoose.models.Content || mongoose.model<IContent>("Content", contentSchema);

export default Content;
