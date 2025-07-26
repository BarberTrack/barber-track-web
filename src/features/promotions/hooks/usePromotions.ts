import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { 
  fetchPromotions,
  updatePromotions,
  clearError,
  clearSuccess,
  resetState,
  selectPromotions,
  selectIsLoading,
  selectError,
  selectSuccess
} from '../store/promotionSlice';
import type { CreatePromotionDTO } from '../types/promotion.types';

export const usePromotions = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const promotions = useSelector(selectPromotions);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  const getPromotions = async (businessId: string) => {
    return dispatch(fetchPromotions(businessId));
  };

  const addPromotion = async (businessId: string, newPromotion: CreatePromotionDTO) => {
    const existingPromotionsWithoutId = promotions.map(p => ({
      title: p.title,
      description: p.description,
      discountType: p.discountType,
      discountValue: p.discountValue,
      validFrom: p.validFrom,
      validTo: p.validTo,
      conditions: p.conditions,
      isActive: p.isActive,
    }));
  
    const promotionsToSend = [...existingPromotionsWithoutId, newPromotion];
  
    return dispatch(updatePromotions({
      businessId,
      data: { promotions: promotionsToSend }
    }));
  };
  

  const removePromotion = async (businessId: string, promotionId: string) => {
    const filteredPromotions = promotions
      .filter(p => p.id !== promotionId)
      .map(p => ({
        title: p.title,
        description: p.description,
        discountType: p.discountType,
        discountValue: p.discountValue,
        validFrom: p.validFrom,
        validTo: p.validTo,
        conditions: p.conditions,
        isActive: p.isActive
      }));
    
    return dispatch(updatePromotions({
      businessId,
      data: { promotions: filteredPromotions }
    }));
  };

  const editPromotion = async (
    businessId: string,
    editedPromotionId: string,
    editedPromotion: CreatePromotionDTO
  ) => {
    const promotionsToSend = promotions.map(p => {
      if (p.id === editedPromotionId) {
        return {
          title: editedPromotion.title,
          description: editedPromotion.description,
          discountType: editedPromotion.discountType,
          discountValue: editedPromotion.discountValue,
          validFrom: editedPromotion.validFrom,
          validTo: editedPromotion.validTo,
          conditions: editedPromotion.conditions,
          isActive: editedPromotion.isActive,
        };
      }
      return {
        title: p.title,
        description: p.description,
        discountType: p.discountType,
        discountValue: p.discountValue,
        validFrom: p.validFrom,
        validTo: p.validTo,
        conditions: p.conditions,
        isActive: p.isActive,
      };
    });
  
    return dispatch(updatePromotions({
      businessId,
      data: { promotions: promotionsToSend }
    }));
  };


  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleClearSuccess = () => {
    dispatch(clearSuccess());
  };

  const handleResetState = () => {
    dispatch(resetState());
  };

  return {
    promotions,
    isLoading,
    error,
    success,
    getPromotions,
    addPromotion,
    removePromotion,
    editPromotion,
    clearError: handleClearError,
    clearSuccess: handleClearSuccess,
    resetState: handleResetState,
  };
};
