import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router';
import { selectAuth } from '../../auth/store/authSlice';
import businessServices from '../services/businessServices';
import { ToastAlert } from '@/shared/components/ToastAlert';

export const useDeletePortfolioImage = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);

    const deletePortfolioImage = async (imageId: string): Promise<boolean> => {
        if (!token) {
            navigate('/');
            return false;
        }

        if (!imageId) {
            ToastAlert.error(
                "Error al eliminar imagen",
                "ID de imagen no válido"
            );
            return false;
        }

        setIsDeleting(true);
        try {
            await businessServices.deletePortfolioImage(imageId);
            
            ToastAlert.success(
                "Imagen eliminada correctamente",
                "La imagen se ha eliminado del portafolio"
            );
            
            return true;
        } catch (error: any) {
            console.error('Error al eliminar imagen del portafolio:', error);
            ToastAlert.error(
                "Error al eliminar imagen",
                error?.message || "Intenta de nuevo"
            );
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        deletePortfolioImage,
        isDeleting
    };
}; 