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

// Tipos para crear servicio
export interface ServiceCreateRequest {
    businessId: string;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    barberAssignments: BarberAssignmentRequest[];
}

export interface BarberAssignmentRequest {
    barberId: string;
    specialPrice?: number;
    isPreferred: boolean;
}

export interface ServiceCreateResponse {
    service: {
        id: string;
        businessId: string;
        name: string;
        description: string;
        price: number;
        durationMinutes: number;
        imageUrl: string | null;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
    created: boolean;
}

export interface ServiceDeleteResponseModel {
    message: string;
    serviceId: string;
    deleted: boolean;
}