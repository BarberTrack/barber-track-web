import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router';
import { selectAuth } from '../../auth/store/authSlice';
import { deleteBarberById, getBarbersByBusinessId } from '../store';
import { ToastAlert } from '@/shared/components/ToastAlert';

export const useDeleteBarber = (barberId: string, businessId: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);

    const deleteBarberByIdApi = useCallback(async () => {
        if (!token) {
            navigate('/');
            return;
        }
        if (!barberId) {
            return;
        }
        try {
            const result = await dispatch(deleteBarberById(barberId)).unwrap();
            const barbersResult = await dispatch(getBarbersByBusinessId(businessId));
            ToastAlert.success(
                "Barbero eliminado correctamente",
                "Barbero eliminado"
            );
            return result;
        }
        catch (error) {
            ToastAlert.error(
                "Error al eliminar barbero",
                "Intenta de nuevo"
            );
            throw error;
        }
    }, [dispatch, navigate, token, barberId]);
    return {
        deleteBarberByIdApi
    }
}