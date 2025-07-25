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

            let portfolioData: BarberPortfolioImage[] = [];
            
        
            const responseAny = response as any;
            
   
            if (responseAny && responseAny.data && Array.isArray(responseAny.data.portfolio)) {
                portfolioData = responseAny.data.portfolio;
            } 
     
            else if (responseAny && Array.isArray(responseAny.portfolio)) {
                portfolioData = responseAny.portfolio;
            }
          
            else if (responseAny && responseAny.data && Array.isArray(responseAny.data)) {
                portfolioData = responseAny.data;
            }
          
            else if (responseAny && Array.isArray(responseAny)) {
                portfolioData = responseAny;
            }
            

            setPortfolioImages(portfolioData);
        } catch (error: any) {

            if (error?.status !== 404) {
                ToastAlert.error(
                    "Error al cargar portafolio",
                    error?.message || "Intenta de nuevo"
                );
            }

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