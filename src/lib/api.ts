// src/lib/api.ts
import axios from 'axios';
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
        email: credentials.email,      // ✅ Now matches type
        password: credentials.password
      });

      console.log('📥 Backend Response:', response.data);
      
      // ✅ Correct path to token
      if (response.data.data?.token) {
        Cookies.set('auth_token', response.data.data.token, { expires: 7 });
      }
      
      return {
        success: response.data.success || true,
        data: response.data.data,  // ✅ Nested data object
        message: response.data.message || 'Login successful',
      };
    } catch (error: any) {
      console.error('❌ Login Error:', error.response?.data || error);
      return {
        success: false,
        data: { user: {} as User, token: '' },
        error: error.response?.data?.message || 'Login failed',
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

    console.log('📥 Backend Response:', response.data);
    
    // ✅ Handle both response formats
    let tokenData, userData;
    
    if (response.data.data) {
      // Format: { success: true, data: { token, user } }
      tokenData = response.data.data.token;
      userData = response.data.data.user;
    } else if (response.data.token) {
      // Format: { token, user }
      tokenData = response.data.token;
      userData = response.data.user;
    } else {
      throw new Error('Invalid response format');
    }

    // ✅ Save token
    if (tokenData) {
      Cookies.set('auth_token', tokenData, { expires: 7 });
    }
    
    return {
      success: true,
      data: {
        token: tokenData,
        user: userData,
      },
      message: response.data.message || 'Account created successfully',
    };
  } catch (error: any) {
    console.error('❌ Signup Error:', error.response?.data || error);
    return {
      success: false,
      data: { user: {} as User, token: '' },
      error: error.response?.data?.message || 'Signup failed',
    };
  }
},

  // Google OAuth Signup
  googleSignup: async (
    data: GoogleSignupData, 
    userType: UserType
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiClient.post(`/auth/google/${userType}`, data);
      
      if (response.data.data?.token) {
        Cookies.set('auth_token', response.data.data.token, { expires: 7 });
      }
      
      return {
        success: response.data.success || true,
        data: response.data.data,
        message: response.data.message || 'Account created successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        data: { user: {} as User, token: '' },
        error: error.response?.data?.message || 'Google signup failed',
      };
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    Cookies.remove('auth_token');
  },
};