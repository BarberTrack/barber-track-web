import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { 
  createBusiness,
  clearError,
  clearSuccess,
  resetState,
  selectCreateBusiness,
  selectIsLoading,
  selectError,
  selectSuccess
} from '../store/createBusinessSlice';
import type { CreateBusinessData } from '../types/business.types';

export const useCreateBusiness = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const createBusinessState = useSelector(selectCreateBusiness);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  const handleCreateBusiness = async (businessData: CreateBusinessData) => {
    return dispatch(createBusiness(businessData));
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
    createBusinessState,
    isLoading,
    error,
    success,
    createBusiness: handleCreateBusiness,
    clearError: handleClearError,
    clearSuccess: handleClearSuccess,
    resetState: handleResetState,
  };
}; 