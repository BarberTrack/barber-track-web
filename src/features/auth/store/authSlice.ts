import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, User, RegisterCredentials } from '../../../shared/types/auth.types';
import { authService } from '../services/authService';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isRegistering: false,
  registerSuccess: false,
};

// Async thunk para login
export const loginUser = createAsyncThunk<
  { user: User; token: string; expiresIn: number },
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      
      // Verificar que la estructura existe antes de acceder
      if (!response.data?.data) {

        return rejectWithValue('Estructura de respuesta inesperada');
      }
      
      const loginData = response.data.data;
   
      
      return loginData;
    } catch (error: any) {
   
      return rejectWithValue(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }
);

// Async thunk para registro
export const registerUser = createAsyncThunk<
  { message: string },
  RegisterCredentials,
  { rejectValue: string }
>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      
      if (!response.data) {
        return rejectWithValue('Estructura de respuesta inesperada');
      }
      
      return { message: response.data.message };
    } catch (error: any) {
      const status = error.response?.status;
      
      if (status === 409) {
        return rejectWithValue('Este correo electrónico ya está registrado');
      } else if (status === 400) {
        return rejectWithValue('Datos inválidos. Por favor verifica la información ingresada');
      } else if (!error.response) {
        return rejectWithValue('Error de conexión. Por favor verifica tu conexión a internet');
      }
      
      return rejectWithValue(error.response?.data?.message || 'Error al registrar usuario');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    await authService.logout();
    dispatch(clearAuth());
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    // Para hidratar el estado desde el localStorage
    hydrateAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Persistir en localStorage
        localStorage.setItem('barbertrack_token', action.payload.token);
        localStorage.setItem('barbertrack_user', JSON.stringify(action.payload.user));
        
        
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error desconocido';
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isRegistering = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.registerSuccess = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegistering = false;
        state.error = action.payload || 'Error desconocido';
        state.registerSuccess = false;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        
        // Limpiar localStorage
        localStorage.removeItem('barbertrack_token');
        localStorage.removeItem('barbertrack_user');
      });
  },
});

export const { clearAuth, clearError, clearRegisterSuccess, setToken, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;