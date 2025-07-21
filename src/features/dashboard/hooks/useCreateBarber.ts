import { useAppDispatch } from '../../../app/hooks';
import { createBarber } from '../store';
import type { BarberCreateRequestModel } from '../types/barber.type';
import { ToastAlert } from '@/shared/components/ToastAlert';
import { getBarbersByBusinessId } from '../store';

export const useCreateBarber = (businessId: string) => {
    const dispatch = useAppDispatch();

    const handleCreateBarber = async (barberData: BarberCreateRequestModel) => {
        try {           
            const result = await dispatch(createBarber(barberData)).unwrap();
            await dispatch(getBarbersByBusinessId(businessId)).unwrap();
            // El reducer ya agrega automáticamente el barbero a la lista
            // No necesitamos hacer una llamada adicional a getBarbersByBusinessId
                       
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

