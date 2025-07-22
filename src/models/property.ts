// models/property.model.ts

import mongoose, { Document, Model } from 'mongoose';

export interface IServiceOffered {
  roomType: string;
  pricePerNight: number;
  amenities: string;
  images: string[];
}

export interface IProperty extends Document {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  imageUrls: string[];
  servicesOffered: IServiceOffered[];
  
  createdAt?: Date;
  updatedAt?: Date;
}

const serviceOfferedSchema = new mongoose.Schema<IServiceOffered>(
  {
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: { type: String },
    images: [{ type: String }],
  },
  { _id: false } // nested, no extra _id needed per room
);

const propertySchema = new mongoose.Schema<IProperty>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    imageUrls: [{ type: String }], // multiple images for the whole property
    servicesOffered: [serviceOfferedSchema], // array of room/service objects
  },
  {
    timestamps: true,
  }
);

const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema);

export default Property;
