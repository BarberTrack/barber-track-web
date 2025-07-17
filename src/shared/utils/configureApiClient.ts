import { apiClient } from './apiClient';

// Función para configurar el apiClient con acceso al store
// Esta se llamará desde main.tsx después de que el store esté configurado
export const configureApiClient = () => {
  // Función para obtener el token del localStorage o store
  const getToken = (): string | null => {
    try {
      // Intentar obtener del localStorage primero (usar la clave correcta)
      const token = localStorage.getItem('barbertrack_token');
      if (token) {
        return token;
      }
      
      // Como fallback, intentar obtener del store dinámicamente
      // Importación dinámica para evitar dependencias circulares
      import('../../app/store').then(({ store }) => {
        return store.getState().auth.token;
      });
      
      return null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Función para manejar logout/unauthorized
  const onUnauthorized = (): void => {
    try {
      // Limpiar localStorage (usar las claves correctas)
      localStorage.removeItem('barbertrack_token');
      localStorage.removeItem('barbertrack_user');
      
      // Importación dinámica para evitar dependencias circulares
      import('../../app/store').then(({ store }) => {
        import('../../features/auth/store/authSlice').then(({ logoutUser }) => {
          store.dispatch(logoutUser());
        });
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Configurar los callbacks
  apiClient.setAuthCallbacks(getToken, onUnauthorized);
}; 