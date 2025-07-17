import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../app/hooks';
import { createService, selectServicesCreating } from '../store';
import type { ServiceCreateRequest } from '../types/services.type';
import { toast } from 'sonner';

export const useCreateService = () => {
    const dispatch = useAppDispatch();
    const isCreating = useSelector(selectServicesCreating);

    const handleCreateService = async (serviceData: ServiceCreateRequest) => {
        try {
            const result = await dispatch(createService(serviceData));
            
            if (createService.fulfilled.match(result)) {
                toast.success('Servicio creado exitosamente');
                // El reducer ya agrega automáticamente el servicio a la lista
                // No necesitamos recargar la lista completa
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