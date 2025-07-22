import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router';
import { selectAuth } from '../../auth/store/authSlice';
import businessServices from '../services/businessServices';
import { ToastAlert } from '@/shared/components/ToastAlert';

export const useDeleteGalleryImage = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);

    const deleteImage = async (imageId: string): Promise<boolean> => {
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
            await businessServices.deleteGalleryImage(imageId);
            
            ToastAlert.success(
                "Imagen eliminada correctamente",
                "La imagen se ha eliminado de la galería"
            );
            
            return true;
        } catch (error: any) {
            console.error('Error al eliminar imagen:', error);
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
        deleteImage,
        isDeleting
    };
}; 