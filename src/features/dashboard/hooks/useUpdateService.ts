import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../app/hooks';
import { updateService, selectServicesUpdating } from '../store';
import type { ServiceUpdateRequest } from '../types/services.type';
import { toast } from 'sonner';

export const useUpdateService = () => {
    const dispatch = useAppDispatch();
    const isUpdating = useSelector(selectServicesUpdating);

    const handleUpdateService = async (serviceId: string, serviceData: ServiceUpdateRequest) => {
        try {
            const result = await dispatch(updateService({ serviceId, serviceData }));
            
            if (updateService.fulfilled.match(result)) {
                toast.success('Servicio actualizado exitosamente');
                return result.payload;
            } else {
                const errorMessage = result.payload as string || 'Error al actualizar el servicio';
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el servicio';
            toast.error(errorMessage);
            throw error;
        }
    };

    return {
        updateService: handleUpdateService,
        isUpdating
    };
}; 