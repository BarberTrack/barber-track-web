export interface LoginCredentials {
    email: string;
    password: string;
  }

  export interface RegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }

  export interface RegisterResponse {
    success: boolean;
    data: {
      message: string;
    };
    timestamp: string;
    service: string;
  }
  
  export interface User {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
    location: string | null;
    notificationPreferences: {
      push: {
        reminders: boolean;
        promotions: boolean;
        appointments: boolean;
      };
      email: {
        reminders: boolean;
        promotions: boolean;
        appointments: boolean;
      };
    };
    behaviorPatterns: {
      login_patterns: {
        device_types: string[];
        last_analysis: string;
        preferred_days: string[];
        total_sessions: number;
        login_frequency: string;
        preferred_hours: string[];
        location_patterns: string[];
      };
      booking_patterns: {
        price_sensitivity: string;
        seasonal_preferences: string;
        average_advance_booking: number;
        preferred_appointment_duration: number;
      };
      engagement_patterns: {
        churn_risk: number;
        loyalty_score: number;
        review_frequency: number;
        referral_likelihood: number;
      };
    };
    createdAt: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    authProvider: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    data: {
      data: {
        user: User;
        token: string;
        expiresIn: number;
      };
    };
    timestamp: string;
    service: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isRegistering: boolean;
    registerSuccess: boolean;
  }
  
  export interface ApiError {
    message: string;
    status: number;
    code?: string;
  }