import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { PromotionsResponse, UpdatePromotionsRequest } from '../types/promotion.types';

class PromotionService {
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

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('barbertrack_token');
          localStorage.removeItem('barbertrack_user');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  async getPromotions(businessId: string): Promise<PromotionsResponse> {
    const response = await this.api.get<PromotionsResponse>(`/businesses/${businessId}/promotions`);
    return response.data;
  }

  async updatePromotions(businessId: string, data: UpdatePromotionsRequest): Promise<PromotionsResponse> {
    const response = await this.api.put<PromotionsResponse>(`/businesses/${businessId}/promotions`, data);
    return response.data;
  }
}

export const promotionService = new PromotionService();
export default PromotionService;
