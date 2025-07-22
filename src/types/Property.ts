export interface Property {
  _id?: string; // MongoDB will add _id
  name: string;
  email: string;
  phone: string;
  location: string;
  servicesOffered: string[];
  bedroom: string;
  pricePerNight: number;
  amenities: string;
  description: string;
  imageUrls: string;
  createdAt?: Date;
  updatedAt?: Date;
}
