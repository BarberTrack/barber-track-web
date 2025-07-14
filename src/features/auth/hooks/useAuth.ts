import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  loginUser, 
  logoutUser, 
  clearError, 
  hydrateAuth,
  selectAuth 
} from '../store/authSlice';
import { authService } from '../services/authService';
import type { LoginCredentials } from '../../../shared/types/auth.types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading, error, isAuthenticated } = useAppSelector(selectAuth);

  // Hidratar el estado desde localStorage al inicializar
  useEffect(() => {
    const storedToken = authService.getToken();
    const storedUser = authService.getCurrentUser();
    
    if (storedToken && storedUser && authService.isTokenValid()) {
      dispatch(hydrateAuth({ user: storedUser, token: storedToken }));
    } else {
      // Si el token no es válido, limpiamos localStorage
      authService.logout();
    }
  }, [dispatch]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      navigate('/home');
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch, navigate]);

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
    navigate('/');
  }, [dispatch, navigate]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Función para obtener el header Authorization
  const getAuthHeader = useCallback(() => {
    return token ? `Bearer ${token}` : '';
  }, [token]);

  // Función para verificar si el usuario está autenticado
  const checkAuth = useCallback(() => {
    return isAuthenticated && token && authService.isTokenValid();
  }, [isAuthenticated, token]);

  return {
    // Estado
    user,
    token,
    isLoading,
    error,
    isAuthenticated: checkAuth(),
    
    // Acciones
    login,
    logout,
    clearAuthError,
    
    // Utilidades
    getAuthHeader,
    checkAuth,
  };
};

export default useAuth;