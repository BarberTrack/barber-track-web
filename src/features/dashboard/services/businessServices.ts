import { apiClient } from '@/shared/utils/apiClient';
import type { BarberCreateRequestModel, BarberUpdateRequestModel } from '../types/barber.type';
import type { ServiceCreateRequest, ServiceCreateResponse, ServiceUpdateRequest, ServiceUpdateResponse } from '../types/services.type';

import type { BusinessesDeleteResponseModel, BusinessUpdateRequestModel, BusinessUpdateResponseModel } from '../types/business.type';
import type { BarberDeleteResponseModel, BarberPortfolioResponse, DeletePortfolioImageResponse } from '../types/barber.type';
import type { ServiceDeleteResponseModel } from '../types/services.type';
import type { Business } from '../types/business.type';
import type { Services } from '../types/services.type';
import type { Barber } from '../types/barber.type';
import type { Reviews, ReviewsParams } from '../types/reviews.type';

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

    async updateBusinessById(businessId: string, business: BusinessUpdateRequestModel): Promise<BusinessUpdateResponseModel> {
        const response = await apiClient.put<BusinessUpdateResponseModel>(`${this.businessEndpoint}/${businessId}`, business);
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

    async updateBarberById(barberId: string, barber: BarberUpdateRequestModel): Promise<Barber> {
        const response = await apiClient.put<Barber>(`${this.barbersEndpoint}/${barberId}`, barber);
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

    async updateServiceById(serviceId: string, serviceData: ServiceUpdateRequest): Promise<ServiceUpdateResponse> {
        const response = await apiClient.put<ServiceUpdateResponse>(`${this.servicesEndpoint}/${serviceId}`, serviceData);
        return response.data;
    }

    async deleteServiceById(serviceId: string): Promise<ServiceDeleteResponseModel> {
        const response = await apiClient.delete<ServiceDeleteResponseModel>(`${this.servicesEndpoint}/${serviceId}`);
        return response.data;
    }

    // Reviews methods (legacy - use getReviews instead)
    async getReviewsByBusinessId(businessId: string): Promise<Reviews> {
        // Use the same endpoint as the new method but with default pagination
        const response = await apiClient.get<Reviews>(`${this.reviewsEndpoint}?businessId=${businessId}&page=1&limit=50`);
        return response.data;
    }

    async getReviews(params: ReviewsParams): Promise<Reviews> {
        const { businessId, status, page = 1, limit = 10 } = params;
        
        const queryParams = new URLSearchParams({
            businessId,
            page: page.toString(),
            limit: limit.toString(),
        });

        if (status && status !== 'all') {
            queryParams.append('status', status);
        }

        const response = await apiClient.get<Reviews>(`${this.reviewsEndpoint}?${queryParams.toString()}`);
        return response.data;
        
    }

    async deleteReview(reviewId: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(`${this.reviewsEndpoint}/${reviewId}`);
        return response.data;
    }

    // Gallery methods
    async uploadGalleryImages(businessId: string, images: File[]): Promise<{ message: string; success: boolean }> {
        const formData = new FormData();
        
        // Agregar cada imagen al FormData
        images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await apiClient.getInstance().post(
            `${this.businessEndpoint}/${businessId}/gallery`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        return response.data;
    }

    async deleteGalleryImage(imageId: string): Promise<{ message: string; success: boolean }> {
        const response = await apiClient.delete<{ message: string; success: boolean }>(`${this.businessEndpoint}/media/${imageId}`);
        return response.data;
    }

    // Barber Portfolio methods
    async uploadBarberPortfolioImages(barberId: string, images: File[]): Promise<{ message: string; success: boolean }> {
        const formData = new FormData();
        
        // Agregar cada imagen al FormData
        images.forEach((image) => {
            formData.append('files', image);
        });

        const response = await apiClient.getInstance().post(
            `${this.barbersEndpoint}/${barberId}/portfolio`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        return response.data;
    }

    async getBarberPortfolio(barberId: string): Promise<BarberPortfolioResponse> {
        const response = await apiClient.get<BarberPortfolioResponse>(`${this.barbersEndpoint}/${barberId}/portfolio`);
        return response.data;
    }

    async deletePortfolioImage(imageId: string): Promise<DeletePortfolioImageResponse> {
        const response = await apiClient.delete<DeletePortfolioImageResponse>(`${this.businessEndpoint}/media/${imageId}`);
        return response.data;
    }
}

export const businessServices = new BusinessServices();
export default businessServices;
