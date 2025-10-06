// src/lib/api.ts
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import type { 
  ApiResponse, 
  LoginCredentials, 
  SignupData, 
  GoogleSignupData,
  User,
  UserType
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ Define error response type
interface ApiErrorResponse {
  message?: string;
  error?: string;
  data?: {
    message?: string;
  };
}

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  // Login
  login: async (
    credentials: LoginCredentials, 
    userType: UserType
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      console.log('📤 Login Request:', credentials);

      const response = await apiClient.post(`/auth/login/${userType}`, {
        email: credentials.email,
        password: credentials.password
      });

      console.log('📥 Backend Response:', response.data);
      
      // ✅ Handle nested data structure
      if (response.data.data?.token) {
        Cookies.set('auth_token', response.data.data.token, { expires: 7 });
      }
      
      return {
        success: response.data.success || true,
        data: response.data.data,
        message: response.data.message || 'Login successful',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error('❌ Login Error:', axiosError.response?.data || axiosError.message);
      
      return {
        success: false,
        data: { user: {} as User, token: '' },
        error: axiosError.response?.data?.message 
          || axiosError.response?.data?.error 
          || axiosError.message 
          || 'Login failed',
      };
    }
  },

  // Email/Password Signup
  signup: async (
    data: SignupData, 
    userType: UserType
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      console.log('📤 Signup Request:', data);

      const response = await apiClient.post(`/auth/signup/${userType}`, {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || '',
        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || null,
      });

      console.log('📥 Signup Backend Response:', response.data);
      
      // ✅ Handle multiple response formats
      let tokenData: string | undefined;
      let userData: User | undefined;
      
      if (response.data.data) {
        // Format: { success: true, data: { token, user } }
        tokenData = response.data.data.token;
        userData = response.data.data.user;
      } else if (response.data.token) {
        // Format: { token, user }
        tokenData = response.data.token;
        userData = response.data.user;
      }

      // ✅ Validate response data
      if (!tokenData || !userData) {
        throw new Error('Invalid response format: missing token or user data');
      }

      // ✅ Save token
      Cookies.set('auth_token', tokenData, { expires: 7 });
      
      return {
        success: true,
        data: {
          token: tokenData,
          user: userData,
        },
        message: response.data.message || 'Account created successfully',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error('❌ Signup Error:', axiosError.response?.data || axiosError.message);
      
      return {
        success: false,
        data: { user: {} as User, token: '' },
        error: axiosError.response?.data?.message 
          || axiosError.response?.data?.error 
          || axiosError.message 
          || 'Signup failed',
      };
    }
  },

  // Google OAuth Signup
  googleSignup: async (
    data: GoogleSignupData, 
    userType: UserType
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      console.log('📤 Google Signup Request:', data);

      // ✅ Use regular signup endpoint with Google data
      const signupData: SignupData = {
        name: data.name,
        email: data.email,
        password: 'GOOGLE_AUTH_' + data.googleId, // Auto-generated password
        phone: '',
        dateOfBirth: '',
        gender: undefined,
      };

      // ✅ Reuse signup method
      return await authApi.signup(signupData, userType);
      
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error('❌ Google Signup Error:', axiosError.response?.data || axiosError.message);
      
      return {
        success: false,
        data: { user: {} as User, token: '' },
        error: axiosError.response?.data?.message 
          || axiosError.response?.data?.error 
          || axiosError.message 
          || 'Google signup failed',
      };
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    Cookies.remove('auth_token');
    Cookies.remove('user');
    localStorage.removeItem('ayu-raksha-storage');
  },
};