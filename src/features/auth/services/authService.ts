import { apiClient } from '@/shared/utils/apiClient';
import type { LoginCredentials, AuthResponse } from '@/shared/types/auth.types';

class AuthService {
  private readonly baseEndpoint = '/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${this.baseEndpoint}/login/email`, credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      // Si tienes endpoint de logout en tu API
      // await apiClient.post(`${this.baseEndpoint}/logout`);
      
      // Limpiar localStorage
      localStorage.removeItem('barbertrack_token');
      localStorage.removeItem('barbertrack_user');
    } catch (error) {
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