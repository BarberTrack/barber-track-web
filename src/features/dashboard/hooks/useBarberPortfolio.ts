import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router';
import { selectAuth } from '../../auth/store/authSlice';
import businessServices from '../services/businessServices';
import { ToastAlert } from '@/shared/components/ToastAlert';
import type { BarberPortfolioImage } from '../types/barber.type';

export const useBarberPortfolio = (barberId: string | null) => {
    const [portfolioImages, setPortfolioImages] = useState<BarberPortfolioImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);

    const fetchPortfolio = async (fetchBarberId?: string) => {
        const targetBarberId = fetchBarberId || barberId;
        
        if (!token) {
            navigate('/');
            return;
        }

        if (!targetBarberId) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await businessServices.getBarberPortfolio(targetBarberId);
            console.log('Response completo:', response); // Debug temporal
            
            // Manejo defensivo de la respuesta
            // La estructura esperada es: { success, message, data: { portfolio: [...] } }
            let portfolioData: BarberPortfolioImage[] = [];
            
            if (response && response.data && Array.isArray(response.data.portfolio)) {
                portfolioData = response.data.portfolio;
            } else if (response && Array.isArray(response.portfolio)) {
                // Fallback si la estructura es diferente
                portfolioData = response.portfolio;
            }
            
            setPortfolioImages(portfolioData);
        } catch (error: any) {
            console.error('Error al obtener portafolio:', error);
            // Solo mostrar error si no es un caso de portafolio vacío
            if (error?.status !== 404) {
                ToastAlert.error(
                    "Error al cargar portafolio",
                    error?.message || "Intenta de nuevo"
                );
            }
            // En caso de error, establecer array vacío
            setPortfolioImages([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (barberId) {
            fetchPortfolio();
        }
    }, [barberId, token]);

    return {
        portfolioImages,
        isLoading,
        fetchPortfolio,
        setPortfolioImages
    };
}; 