import { apiClient } from '@/shared/utils/apiClient';
import type { BusinessesResponseModel } from '../types/business.type';
import type { BarberCreateRequestModel, BarberResponseModel } from '../types/barber.type';
import type { ServicesResponseModel, ServiceCreateRequest, ServiceCreateResponse } from '../types/services.type';
import type { ReviewsResponseModel } from '../types/reviews.type';
import type { BusinessesDeleteResponseModel, BusinessUpdateRequestModel } from '../types/business.type';
import type { BarberDeleteResponseModel } from '../types/barber.type';
import type { ServiceDeleteResponseModel } from '../types/services.type';
import type { Business } from '../types/business.type';
import type { Services } from '../types/services.type';
import type { Barber } from '../types/barber.type';
import type { Reviews } from '../types/reviews.type';

class BusinessServices {
    private readonly businessEndpoint = '/businesses';
    private readonly barbersEndpoint = '/barbers';
    private readonly servicesEndpoint = '/services-business';
    private readonly reviewsEndpoint = '/reviews';

    // Business methods
    async getBusinessesById(businessId: string): Promise<Business> {
        const response = await apiClient.get<Business>(`${this.businessEndpoint}/${businessId}`);
        return response.data;
    }

    async deleteBusinessById(businessId: string): Promise<BusinessesDeleteResponseModel> {
        const response = await apiClient.delete<BusinessesDeleteResponseModel>(`${this.businessEndpoint}/${businessId}`);
        return response.data;
    }

    async updateBusinessById(businessId: string, business: BusinessUpdateRequestModel): Promise<BusinessesResponseModel> {
        const response = await apiClient.put<BusinessesResponseModel>(`${this.businessEndpoint}/${businessId}`, business);
        return response.data;
    }

    // Barber methods
    async getBarbersByBusinessId(businessId: string): Promise<Barber[]> {
        const response = await apiClient.get<Barber[]>(`${this.barbersEndpoint}/business/${businessId}`);
        return response.data;
    }

    async createBarber(barber: BarberCreateRequestModel): Promise<Barber> {
        const response = await apiClient.post<Barber>(`${this.barbersEndpoint}`, barber);
        return response.data;
    }

    async deleteBarberById(barberId: string): Promise<BarberDeleteResponseModel> {
        const response = await apiClient.delete<BarberDeleteResponseModel>(`${this.barbersEndpoint}/${barberId}`);
        return response.data;
    }

    // Services methods
    async getServicesByBusinessId(businessId: string): Promise<Services> {
        const response = await apiClient.get<Services>(`${this.servicesEndpoint}/business/${businessId}`);
        return response.data;
    }

    async createService(serviceData: ServiceCreateRequest): Promise<ServiceCreateResponse> {
        const response = await apiClient.post<ServiceCreateResponse>(`${this.servicesEndpoint}`, serviceData);
        return response.data;
    }

    async deleteServiceById(serviceId: string): Promise<ServiceDeleteResponseModel> {
        const response = await apiClient.delete<ServiceDeleteResponseModel>(`${this.servicesEndpoint}/${serviceId}`);
        return response.data;
    }

    // Reviews methods
    async getReviewsByBusinessId(businessId: string): Promise<Reviews> {
        const response = await apiClient.get<Reviews>(`${this.reviewsEndpoint}/business/${businessId}`);
        return response.data;
    }
}

export const businessServices = new BusinessServices();
export default businessServices;
