import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { store } from '../../app/store';
import { logoutUser } from '../../features/auth/store/authSlice';

class ApiClient {
  private instance: AxiosInstance;
  private readonly baseURL = import.meta.env.API_URL;

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

  private setupInterceptors() {
    // Request interceptor para agregar token
    this.instance.interceptors.request.use(
      (config) => {
        const token = store.getState().auth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para manejar errores
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Dispatch logout action
          store.dispatch(logoutUser());
          
          // Redirect to login
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  // Métodos HTTP
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  // Método para obtener la instancia de axios si necesitas más control
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient();
export default ApiClient;