import type { S } from "node_modules/react-router/dist/development/route-data-D7Xbr_Ww.d.mts";

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

export interface BarberDeleteResponseModel {
    message: string;
    deleted: boolean;
}

