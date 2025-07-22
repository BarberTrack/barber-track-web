import { useAppDispatch } from '../../../app/hooks';
import { updateBarber, getBarbersByBusinessId } from '../store';
import type { BarberUpdateRequestModel } from '../types/barber.type';
import { ToastAlert } from '@/shared/components/ToastAlert';

export const useUpdateBarber = (businessId: string) => {
    const dispatch = useAppDispatch();

    const handleUpdateBarber = async (barberId: string, barberData: BarberUpdateRequestModel) => {
        try {           
            const result = await dispatch(updateBarber({ barberId, barberData })).unwrap();
            await dispatch(getBarbersByBusinessId(businessId)).unwrap();
                       
            ToastAlert.success(
                "Barbero actualizado correctamente",
                "Datos guardados"
            );
            return result;
        }
        catch (error) {
            console.error('Error actualizando barbero:', error);
            ToastAlert.error(
                "Error al actualizar barbero",
                "Intenta de nuevo"
            );
            throw error;
        }
    };

    return {
        handleUpdateBarber
    }
}; 