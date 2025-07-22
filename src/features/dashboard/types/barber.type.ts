export interface BarberResponseModel {
    success: boolean;
    message: string;
    data:    Barber[];
}

export interface Barber {
    id:              string;
    businessId:      string;
    firstName:       string;
    lastName:        string;
    bio:             string;
    specialties:     string[];
    workSchedule:    WorkSchedule;
    portfolioImages: string[] | null;
    yearsExperience: number;
    ratingAverage:   string;
    totalReviews:    number;
    isActive:        boolean;
    createdAt:       Date;
    updatedAt:       Date;
}

export type BarberHourDay =
| { start: string; end: string }
| { off: true };

export interface WorkSchedule {
monday: BarberHourDay;
tuesday: BarberHourDay;
wednesday: BarberHourDay;
thursday: BarberHourDay;
friday: BarberHourDay;
saturday: BarberHourDay;
sunday: BarberHourDay;
}

export interface BarberCreateRequestModel {
    businessId:string;
    firstName: string;
    lastName: string;
    bio: string;
    specialties: string[];
    workSchedule: WorkSchedule;
    yearsExperience: number;
}

export interface BarberUpdateRequestModel {
    firstName: string;
    lastName: string;
    bio: string;
    specialties: string[];
    workSchedule: WorkSchedule;
    yearsExperience: number;
    isActive: boolean;
}

export interface BarberDeleteResponseModel {
    message: string;
    deleted: boolean;
}

// Nuevos tipos para el portafolio del barbero
export interface BarberPortfolioImage {
    id: string;
    url: string;
}

export interface BarberPortfolioResponse {
    success: boolean;
    message: string;
    data: {
        portfolio: BarberPortfolioImage[];
    };
}

export interface DeletePortfolioImageResponse {
    success: boolean;
    message: string;
}

