export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open?: string;
  close?: string;
  closed?: boolean;
}

export interface CancellationPolicy {
  hoursBeforeAppointment: number;
  refundPercentage: number;
}

export interface Location {
  latitude: number; // Valor flotante para latitud
  longitude: number; // Valor flotante para longitud
  address: string;
}

export interface CreateBusinessData {
  name: string;
  description: string;
  address: string;
  latitude: number; // Valor flotante para latitud
  longitude: number; // Valor flotante para longitud
  phone: string;
  email: string;
  businessHours: BusinessHours;
  cancellationPolicy: CancellationPolicy;
}

export interface CreateBusinessFormData {
  name: string;
  description: string;
  phone: string;
  email: string;
  location: Location | null;
  businessHours: BusinessHours;
}

export interface CreateBusinessState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface CreateBusinessResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    description: string;
    address: string;
    latitude: number; // Valor flotante para latitud
    longitude: number; // Valor flotante para longitud
    phone: string;
    email: string;
    businessHours: BusinessHours;
    cancellationPolicy: CancellationPolicy;
    createdAt: string;
  };
} 