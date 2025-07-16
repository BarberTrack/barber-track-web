import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { createBarber, getBarbersByBusinessId } from '../store/businessSlice';
import type { BarberCreateRequestModel } from '../types/barber.type';
import { ToastAlert } from '@/shared/components/ToastAlert';

export const useCreateBarber = (businessId: string) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleCreateBarber = async (barberData: BarberCreateRequestModel) => {
        try {           
            const result = await dispatch(createBarber(barberData)).unwrap();
            
            const barbersResult = await dispatch(getBarbersByBusinessId(businessId));
                       
            ToastAlert.success(
                "Barbero creado correctamente",
                "Barbero creado"
            );
            return result;
        }
        catch (error) {
            console.error('Error creando barbero:', error);
            ToastAlert.error(
                "Error al crear barbero",
                "Intenta de nuevo"
            );
            throw error;
        }
    };

    return {
        handleCreateBarber
    }
}

