import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../app/store';
import { createService, getServicesByBusinessId, selectIsCreatingService } from '../store/businessSlice';
import type { ServiceCreateRequest } from '../types/services.type';
import { toast } from 'sonner';

export const useCreateService = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isCreating = useSelector(selectIsCreatingService);

    const handleCreateService = async (serviceData: ServiceCreateRequest) => {
        try {
            const result = await dispatch(createService(serviceData));
            
            if (createService.fulfilled.match(result)) {
                toast.success('Servicio creado exitosamente');
                // Recargar la lista de servicios después de crear uno nuevo
                dispatch(getServicesByBusinessId(serviceData.businessId));
                return result.payload;
            } else {
                const errorMessage = result.payload as string || 'Error al crear el servicio';
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear el servicio';
            toast.error(errorMessage);
            throw error;
        }
    };

    return {
        createService: handleCreateService,
        isCreating
    };
}; 