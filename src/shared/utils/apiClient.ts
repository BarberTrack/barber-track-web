import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Tipos para las respuestas de API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private instance: AxiosInstance;
  private readonly baseURL = import.meta.env.VITE_API_URL;
  private getTokenCallback?: () => string | null;
  private onUnauthorizedCallback?: () => void;

  constructor() {
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
    });

    this.setupInterceptors();
  }

  // Método para configurar callbacks desde fuera del apiClient
  setAuthCallbacks(getToken: () => string | null, onUnauthorized: () => void) {
    this.getTokenCallback = getToken;
    this.onUnauthorizedCallback = onUnauthorized;
  }

  private setupInterceptors() {
    // Request interceptor para agregar token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getTokenCallback?.();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para manejar errores y respuestas
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Llamar callback de no autorizado
          this.onUnauthorizedCallback?.();
          
          // Redirect to login
          window.location.href = '/';
          return Promise.reject(error);
        }

        // Formatear errores de manera consistente
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'Error desconocido',
          status: error.response?.status || 500,
          errors: error.response?.data?.errors
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Métodos HTTP genéricos
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // Método para obtener la instancia si necesitas más control
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient();
export default ApiClient;