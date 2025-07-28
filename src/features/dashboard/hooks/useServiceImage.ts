import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { getServicesByBusinessId } from '../store';
import { businessServices } from '../services/businessServices';
import { ToastAlert } from '@/shared/components/ToastAlert';

export const useServiceImage = () => {
    const dispatch = useAppDispatch();
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const uploadServiceImage = async (serviceId: string, file: File, businessId: string) => {
        setIsUploading(true);
        try {
            const response = await businessServices.uploadServiceImage(serviceId, file);
            
            if (response.success) {
                ToastAlert.success('Imagen subida', 'La imagen del servicio se ha subido correctamente');
                // Refrescar los servicios
                dispatch(getServicesByBusinessId(businessId));
                return response;
            } else {
                ToastAlert.error('Error', 'Error al subir la imagen');
                throw new Error('Error al subir la imagen');
            }
        } catch (error: any) {
            if (error.status === 400) {
                ToastAlert.error('Archivo inválido', 'El archivo seleccionado no es válido');
            } else {
                ToastAlert.error('Error', 'Error al subir la imagen');
            }
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const deleteServiceImage = async (serviceId: string, businessId: string) => {
        setIsDeleting(true);
        try {
            const response = await businessServices.deleteServiceImage(serviceId);
            
            // El response del servidor no tiene success: true, pero si tiene message y serviceId significa que fue exitoso
            if (response.message && response.serviceId) {
                ToastAlert.success('Imagen eliminada', 'La imagen del servicio se ha eliminado correctamente');
                // Refrescar los servicios
                dispatch(getServicesByBusinessId(businessId));
                return response;
            } else {
                ToastAlert.error('Error', 'Error al eliminar la imagen');
                throw new Error('Error al eliminar la imagen');
            }
        } catch (error: any) {
            ToastAlert.error('Error', 'Error, vuelve a intentar en un momento');
            throw error;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        uploadServiceImage,
        deleteServiceImage,
        isUploading,
        isDeleting
    };
}; 