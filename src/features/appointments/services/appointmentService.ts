import { apiClient } from '@/shared/utils/apiClient';
import type { 
  AppointmentsData,
  QueryParams,
  AppointmentStatus
} from '../types/appointment.types';

class AppointmentService {
  private readonly baseEndpoint = '/appointments';

  /**
   * Obtiene todas las citas de un negocio con paginación y filtros opcionales
   */
  async getAppointmentsByBusinessId(
    businessId: string, 
    params?: QueryParams
  ): Promise<AppointmentsData> {
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar parámetros de consulta
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.barberId) queryParams.append('barberId', params.barberId);

      const url = `${this.baseEndpoint}/business/${businessId}`;
      const finalUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
      
      
      const response = await apiClient.get<AppointmentsData>(finalUrl);
      
      // El response.data ya es la estructura AppointmentsData
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener las citas del negocio'
      );
    }
  }

  /**
   * Obtiene citas filtradas por estado específico
   */
  async getAppointmentsByStatus(
    businessId: string, 
    status: AppointmentStatus, 
    params?: Omit<QueryParams, 'status'>
  ): Promise<AppointmentsData> {
    try {
      const queryParamsWithStatus = {
        ...params,
        status,
      };
      
      const result = await this.getAppointmentsByBusinessId(businessId, queryParamsWithStatus);
      return result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        `Error al obtener las citas con estado ${status}`
      );
    }
  }



  /**
   * Obtiene citas de un barbero específico
   */
  async getAppointmentsByBarber(
    businessId: string,
    barberId: string,
    params?: Omit<QueryParams, 'barberId'>
  ): Promise<AppointmentsData> {
    try {
      const queryParamsWithBarber = {
        ...params,
        barberId,
      };
      
      const result = await this.getAppointmentsByBusinessId(businessId, queryParamsWithBarber);
      return result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener las citas del barbero'
      );
    }
  }

  /**
   * Marca una cita como completada
   */
  async completeAppointment(
    appointmentId: string,
    barberNotes: string,
    completedBy: string
  ): Promise<void> {
    try {
      const url = `${this.baseEndpoint}/${appointmentId}/complete`;
      const body = {
        barberNotes,
        completedBy
      };
      
      await apiClient.put(url, body);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Error al marcar la cita como completada'
      );
    }
  }

  /**
   * Cancela una cita
   */
  async cancelAppointment(
    appointmentId: string,
    reason: string
  ): Promise<void> {
    try {
      const url = `${this.baseEndpoint}/${appointmentId}/cancel`;
      const body = {
        reason,
        cancelledBy: "business"
      };
      
      await apiClient.delete(url, { data: body });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Error al cancelar la cita'
      );
    }
  }
}

export const appointmentService = new AppointmentService(); 