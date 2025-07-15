import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { BusinessesResponseModel } from '../types/business.type';
import type { BarberResponseModel } from '../types/barber.type';
import type { ServicesResponseModel } from '../types/services.type';
import type { ReviewsResponseModel } from '../types/reviews.type';

class BusinessServices {
    private api: AxiosInstance;
    private readonly baseURL = import.meta.env.VITE_API_URL;
    
    constructor() {
        this.api = axios.create({
          baseURL: this.baseURL,
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
          },
        });
        this.api.interceptors.request.use(
          (config) => {
            const token = localStorage.getItem('barbertrack_token');
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
          },
          (error) => Promise.reject(error)
        );
    
        // Interceptor para manejar respuestas
        this.api.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response?.status === 401) {
              // Token expirado o inválido
              localStorage.removeItem('barbertrack_token');
              localStorage.removeItem('barbertrack_user');
              window.location.href = '/';
            }
            return Promise.reject(error);
          }
        );
      }
      async getBusinessesById(businessId: string): Promise<BusinessesResponseModel> {
        const response = await this.api.get<BusinessesResponseModel>(`/businesses/${businessId}`);
        return response.data;
    }

    async getBarbersByBusinessId(businessId: string): Promise<BarberResponseModel> {
        const response = await this.api.get<BarberResponseModel>(`/barbers/business/${businessId}`);
        return response.data;
    }

    async getServicesByBusinessId(businessId: string): Promise<ServicesResponseModel> {
        const response = await this.api.get<ServicesResponseModel>(`/services-business/business/${businessId}`);
        return response.data;
    }

    async getReviewsByBusinessId(businessId: string): Promise<ReviewsResponseModel> {
        const response = await this.api.get<ReviewsResponseModel>(`/reviews/business/${businessId}`);
        return response.data;
    }   

}

export const businessServices = new BusinessServices();
export default businessServices;
