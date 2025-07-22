import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router';
import { selectAuth } from '../../auth/store/authSlice';
import { deleteBusinessById } from '../store';

export const useDeleteBusiness = (businessId:string) =>{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);

    const deleteBusinessByIdApi = useCallback(async () => {
        if (!token) {
            navigate('/');
            return;
        }
        if (!businessId) {
            return;
        }
        try {
            await dispatch(deleteBusinessById(businessId)).unwrap();
            navigate('/home');
        }
        catch (error) {
            throw error;
        }
    }, [dispatch, navigate, token, businessId]);
    return {
        deleteBusinessByIdApi
    }
}
