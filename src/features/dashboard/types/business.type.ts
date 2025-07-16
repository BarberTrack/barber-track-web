export interface BusinessesResponseModel {
    success: boolean;
    message: string;
    data: Business;
  }
  
  export interface Business {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    address: string;
    latitude: null;
    longitude: null;
    phone: string;
    email: string;
    businessHours: BusinessHours;
    galleryImages: GalleryImage[];
    cancellationPolicy: CancellationPolicy;
    breakSettings: null;
    products: null;
    promotions: null;
    ratingAverage: number;
    totalReviews: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type BusinessHourDay =
    | { open: string; close: string }
    | { closed: true };
  
  export interface BusinessHours {
    monday: BusinessHourDay;
    tuesday: BusinessHourDay;
    wednesday: BusinessHourDay;
    thursday: BusinessHourDay;
    friday: BusinessHourDay;
    saturday: BusinessHourDay;
    sunday: BusinessHourDay;
  }
  
  export interface GalleryImage {
    id: string;
    url: string;
    filename: string;
    uploadDate: Date;
  }
  
  export interface CancellationPolicy {
    notice: string;
    penalty: string;
  }
  
export interface BusinessesDeleteResponseModel {
  message: string;
  businessId: string;
  availabilityId: string;
}

