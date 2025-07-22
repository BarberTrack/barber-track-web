import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router';
import { selectAuth } from '../../auth/store/authSlice';
import businessServices from '../services/businessServices';
import { ToastAlert } from '@/shared/components/ToastAlert';

export const useUploadGalleryImages = (businessId: string) => {
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);

    const uploadImages = async (images: File[]): Promise<boolean> => {
        if (!token) {
            navigate('/');
            return false;
        }

        if (!images || images.length === 0) {
            ToastAlert.error(
                "No hay imágenes seleccionadas",
                "Selecciona al menos una imagen"
            );
            return false;
        }

        setIsUploading(true);
        try {
            await businessServices.uploadGalleryImages(businessId, images);
            
            ToastAlert.success(
                images.length === 1 ? "Imagen subida correctamente" : "Imágenes subidas correctamente",
                "Galería actualizada"
            );
            
            return true;
        } catch (error: any) {
            console.error('Error al subir imágenes:', error);
            ToastAlert.error(
                "Error al subir imágenes",
                error?.message || "Intenta de nuevo"
            );
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        uploadImages,
        isUploading
    };
}; 