import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
    // Business
    getBusinessById,
    selectBusiness,
    selectBusinessLoading,
    selectBusinessError,
    // Barbers
    getBarbersByBusinessId,
    selectBarbers,
    selectBarbersLoading,
    selectBarbersError,
    // Services
    getServicesByBusinessId,
    selectServices,
    selectServicesLoading,
    selectServicesError,
    // Reviews
    getReviewsByBusinessId,
    selectReviews,
    selectReviewsLoading,
    selectReviewsError,
} from '../store';

/**
 * Hook personalizado que maneja todos los datos del dashboard
 * Demuestra cómo usar los nuevos slices especializados
 */
export const useDashboardData = (businessId: string) => {
    const dispatch = useAppDispatch();

    // Selectores de Business
    const business = useAppSelector(selectBusiness);
    const businessLoading = useAppSelector(selectBusinessLoading);
    const businessError = useAppSelector(selectBusinessError);

    // Selectores de Barbers
    const barbers = useAppSelector(selectBarbers);
    const barbersLoading = useAppSelector(selectBarbersLoading);
    const barbersError = useAppSelector(selectBarbersError);

    // Selectores de Services
    const services = useAppSelector(selectServices);
    const servicesLoading = useAppSelector(selectServicesLoading);
    const servicesError = useAppSelector(selectServicesError);

    // Selectores de Reviews
    const reviews = useAppSelector(selectReviews);
    const reviewsLoading = useAppSelector(selectReviewsLoading);
    const reviewsError = useAppSelector(selectReviewsError);

    // Cargar datos iniciales
    useEffect(() => {
        if (businessId) {
            // Cada acción va a su slice correspondiente
            dispatch(getBusinessById(businessId));
            dispatch(getBarbersByBusinessId(businessId));
            dispatch(getServicesByBusinessId(businessId));
            dispatch(getReviewsByBusinessId(businessId));
        }
    }, [dispatch, businessId]);

    // Estado combinado de loading
    const isLoading = businessLoading || barbersLoading || servicesLoading || reviewsLoading;
    
    // Estado combinado de errores
    const hasError = !!(businessError || barbersError || servicesError || reviewsError);
    const errors = {
        business: businessError,
        barbers: barbersError,
        services: servicesError,
        reviews: reviewsError,
    };

    return {
        // Datos
        business,
        barbers,
        services,
        reviews,
        
        // Estados de loading individuales
        businessLoading,
        barbersLoading,
        servicesLoading,
        reviewsLoading,
        
        // Estado de loading general
        isLoading,
        
        // Errores individuales
        businessError,
        barbersError,
        servicesError,
        reviewsError,
        
        // Estado de error general
        hasError,
        errors,
    };
}; 