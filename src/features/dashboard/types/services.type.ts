export interface ServicesResponseModel {
    success: boolean;
    message: string;
    data:    Services;
}

export interface Services {
    services: Service[];
    packages: any[];
}

export interface Service {
    id:                string;
    businessId:        string;
    name:              string;
    description:       string;
    price:             string;
    durationMinutes:   number;
    imageUrl:          null;
    isActive:          boolean;
    barberAssignments: BarberAssignment[];
    createdAt:         Date;
    updatedAt:         Date;
}

export interface BarberAssignment {
    barberId:     string;
    isPreferred:  boolean;
    specialPrice: number;
    first_name:   string;
    last_name:    string;
}
