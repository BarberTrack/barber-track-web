import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { LoginCredentials, AuthResponse } from '@/shared/types/auth.types';

class AuthService {
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

    // Interceptor para agregar el token a las requests
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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login/email', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      // Si tienes endpoint de logout en tu API
      // await this.api.post('/auth/logout');
      
      // Limpiar localStorage
      localStorage.removeItem('barbertrack_token');
      localStorage.removeItem('barbertrack_user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Método para verificar si el token es válido
  isTokenValid(): boolean {
    const token = localStorage.getItem('barbertrack_token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Método para obtener el token actual
  getToken(): string | null {
    return localStorage.getItem('barbertrack_token');
  }

  // Método para obtener el usuario actual desde localStorage
  getCurrentUser() {
    const userString = localStorage.getItem('barbertrack_user');
    return userString ? JSON.parse(userString) : null;
  }
}

export const authService = new AuthService();
export default AuthService;