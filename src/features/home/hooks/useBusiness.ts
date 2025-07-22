import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getBusinesses, selectBusinesses } from '../store/businessSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAuth } from '../../auth/store/authSlice';

export const useBusiness = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {token} = useAppSelector(selectAuth);
    const businesses = useAppSelector(selectBusinesses);
    
    const getBusinessesApi = useCallback(async () => {
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const result = await dispatch(getBusinesses()).unwrap();
            return result;
        }catch (error) {
            throw error;
          }
    }, [dispatch, navigate, token]);

    useEffect(() => {
        getBusinessesApi();
      }, [getBusinessesApi]);

    return{
        businesses,
    }
}