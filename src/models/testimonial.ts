import mongoose, { Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  message: string;
  rating: number; // ✅ Add this
  createdAt?: Date;
  updatedAt?: Date;
}

const testimonialSchema = new mongoose.Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // ✅ Add this
  },
  {
    timestamps: true,
  }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", testimonialSchema);

export default Testimonial;
