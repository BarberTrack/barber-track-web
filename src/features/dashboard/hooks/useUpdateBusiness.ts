import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router';
import { selectAuth } from '../../auth/store/authSlice';
import { updateBusinessById } from '../store';
import { ToastAlert } from '../../../shared/components/ToastAlert';
import type { BusinessUpdateRequestModel } from '../types/business.type';

export const useUpdateBusiness = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useAppSelector(selectAuth);

  const updateBusinessByIdApi = useCallback(
    async (businessId: string, business: BusinessUpdateRequestModel) => {
      if (!token) {
        navigate('/');
        return;
      }
      if (!businessId) {
        return;
      }
      try {
        // console.log('🔄 Actualizando business:', { businessId, business });
        await dispatch(updateBusinessById({ businessId, business })).unwrap();
        ToastAlert.success("Negocio actualizado correctamente", "Datos guardados");

      } catch (error) {
        console.error('❌ Error al actualizar business:', error);
        ToastAlert.error("Algo salió mal", "Intenta de nuevo");
      }
    },
    [dispatch, navigate, token]
  );

  return { updateBusinessByIdApi };
};
