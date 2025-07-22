import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router';
import { selectAuth } from '../../auth/store/authSlice';
import { deleteServiceById, getServicesByBusinessId } from '../store';
import { ToastAlert } from '@/shared/components/ToastAlert';

export const useDeleteService = (serviceId: string, businessId: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);

    const deleteServiceByIdApi = useCallback(async () => {
        if (!token) {
            navigate('/');
            return;
        }
        if (!serviceId) {
            return;
        }
        try {
            const result = await dispatch(deleteServiceById(serviceId)).unwrap();
            await dispatch(getServicesByBusinessId(businessId));
            ToastAlert.success(
                "Servicio eliminado correctamente",
                "Servicio eliminado"
            );
            return result;
        }
        catch (error) {
            ToastAlert.error(
                "Error al eliminar servicio",
                "Intenta de nuevo"
            );
            throw error;
        }
    }, [dispatch, navigate, token, serviceId, businessId]);
    
    return {
        deleteServiceByIdApi
    }
} 