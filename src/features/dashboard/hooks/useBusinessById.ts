import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
    getBusinessById,
    selectBusinessById,
    getBarbersByBusinessId,
    selectBarbersByBusinessId,
    selectServicesByBusinessId,
    getServicesByBusinessId,
    getReviewsByBusinessId,
    selectReviewsByBusinessId
} from '../store/businessSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAuth } from '../../auth/store/authSlice';

export const useBusinessById = (businessId: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);
    const business = useAppSelector(selectBusinessById);

    const getBusinessByIdApi = useCallback(async () => {
        if (!token) {
            navigate('/');
            return;
        }
        if (!businessId) {
            return;
        }
        try {
            const result = await dispatch(getBusinessById(businessId)).unwrap();
            return result;
        }
        catch (error) {
            throw error;
        }
    }, [dispatch, navigate, token, businessId]);

    useEffect(() => {
        getBusinessByIdApi();
    }, [getBusinessByIdApi]);

    return {
        business,
    }
}

export const useBarbersByBusinessId = (businessId: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);
    const barbers = useAppSelector(selectBarbersByBusinessId);

    const getBarbersByBusinessIdApi = useCallback(async () => {
        if (!token) {
            navigate('/');
            return;
        }
        if (!businessId) {
            return;
        }
        try {
            const result = await dispatch(getBarbersByBusinessId(businessId)).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    }, [dispatch, navigate, token, businessId]);

    useEffect(() => {
        getBarbersByBusinessIdApi();
    }, [getBarbersByBusinessIdApi]);

    return {
        barbers,
    }
}

export const useServicesByBusinessId = (businessId: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);
    const services = useAppSelector(selectServicesByBusinessId);

    const getServicesByBusinessIdApi = useCallback(async () => {
        if (!token) {
            navigate('/');
            return;
        }
        if (!businessId) {
            return;
        }
        try {
            const result = await dispatch(getServicesByBusinessId(businessId)).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    }, [dispatch, navigate, token, businessId]);

    useEffect(() => {
        getServicesByBusinessIdApi();
    }, [getServicesByBusinessIdApi]);

    return {
        services,
    }
}

export const useReviewsByBusinessId = (businessId: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector(selectAuth);
    const reviews = useAppSelector(selectReviewsByBusinessId);
    
    const getReviewsByBusinessIdApi = useCallback(async () => {
        if (!token) {
            navigate('/');
            return;
        }
        if (!businessId) {
            return;
        }
        try {
            const result = await dispatch(getReviewsByBusinessId(businessId)).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    }, [dispatch, navigate, token, businessId]);

    useEffect(() => {
        getReviewsByBusinessIdApi();
    }, [getReviewsByBusinessIdApi]);

    return {
        reviews,
    }
}                   