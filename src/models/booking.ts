import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  name: string;
  email: string;
  fromDate: Date;
  endDate: Date;
  people: number;
  roomType?: string;
  propertyId: string; // <--- Add this
  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    fromDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    people: { type: Number, required: true, min: 1 },
    roomType: { type: String },
    propertyId: { type: String, required: true }, // <--- Add this too
  },
  {
    timestamps: true,
  }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
