// src/lib/api.ts
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { supabase } from './supabase';
import type { 
  ApiResponse, 
  LoginCredentials, 
  SignupData, 
  GoogleSignupData,
  User,
  UserType
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

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
  // Don't override an explicitly provided Authorization header
  const hasExplicitAuth = !!config.headers?.Authorization;
  if (!hasExplicitAuth) {
    const token = Cookies.get('auth_token');
    if (token && token !== 'undefined') {
      if (!config.headers) config.headers = {} as any;
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authApi = {
  // Exchange a Supabase access token for a backend JWT
 // Exchange a Supabase access token for a backend session (cookie) & user
syncWithSupabaseToken: async (
  accessToken: string,
  userType: UserType,
  extra?: Record<string, any>
): Promise<ApiResponse<{ user: User; token: string }>> => {
  try {
    const payload = {
      userType,
      ...(extra || {}),
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log('[auth.sync] baseURL =', API_BASE_URL);
      console.log('[auth.sync] sending Authorization: Bearer', accessToken?.slice(0, 12) + '...');
    }

    const syncResponse = await apiClient.post('/auth/sync', payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Supabase-Token': accessToken,
      },
    });

    let userData: User;

    if (syncResponse.data?.data?.user) {
      userData = syncResponse.data.data.user;
    } else if (syncResponse.data?.user) {
      userData = syncResponse.data.user;
    } else {
      throw new Error('Invalid sync response format: missing user');
    }

    // Backend has set HttpOnly auth_token cookie
    return {
      success: true,
      data: {
        token: accessToken,
        user: userData,
      },
      message: 'Sync successful',
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return {
      success: false,
      data: { user: {} as User, token: '' },
      error:
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        (error as Error).message ||
        'Sync failed',
    };
  }
},

  // Fetch current user from backend using JWT in cookies/headers
  me: async (): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await apiClient.get('/auth/me');

      let userData: User | undefined;
      if (response.data?.data?.user) {
        userData = response.data.data.user;
      } else if (response.data?.user) {
        userData = response.data.user;
      } else if (response.data?.data) {
        userData = response.data.data as User;
      }

      if (!userData) {
        throw new Error('Invalid response format: missing user');
      }

      return {
        success: true,
        data: { user: userData },
        message: 'OK',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return {
        success: false,
        data: { user: {} as User },
        error:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          (error as Error).message ||
          'Failed to fetch user',
      };
    }
  },
  // Supabase Login (New primary method)
  // Supabase Login (New primary method)
supabaseLogin: async (
  credentials: LoginCredentials,
  userType: UserType
): Promise<ApiResponse<{ user: User; token: string }>> => {
  try {
    console.log('📤 Supabase Login Request:', credentials);

    // Ensure Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error(
        'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file'
      );
    }

    // 1️⃣ Login with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (authError) {
      console.error('❌ Supabase Auth Error:', authError);
      throw new Error(authError.message);
    }

    const accessToken = authData.session?.access_token;
    if (!accessToken) {
      throw new Error('No access token received from Supabase');
    }

    console.log('✅ Supabase authentication successful');

    // 2️⃣ Sync with backend (backend will set HttpOnly auth_token cookie)
    const syncResponse = await apiClient.post(
      '/auth/sync',
      {
        userType,
        email: credentials.email,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Supabase-Token': accessToken,
        },
      }
    );

    console.log('📥 Backend Sync Response:', syncResponse.data);

    // 3️⃣ Extract user only (do NOT expect token from backend)
    let userData: User;

    if (syncResponse.data?.data?.user) {
      userData = syncResponse.data.data.user;
    } else if (syncResponse.data?.user) {
      userData = syncResponse.data.user;
    } else {
      console.error('❌ Invalid sync response format:', syncResponse.data);
      throw new Error('Invalid sync response format: missing user');
    }

    // ✅ At this point:
    // - Backend has set the HttpOnly "auth_token" cookie
    // - Supabase holds the access token on the client
    // We return Supabase access token so caller can use it in client-side state if needed
    return {
      success: true,
      data: {
        token: accessToken,
        user: userData,
      },
      message: 'Login successful',
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.error('❌ Supabase Login Error:', error);

    return {
      success: false,
      data: { user: {} as User, token: '' },
      error:
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        (error as Error).message ||
        'Login failed',
    };
  }
},


  // Supabase Signup
 // Supabase Signup
supabaseSignup: async (
  data: SignupData,
  userType: UserType
): Promise<ApiResponse<{ user: User; token: string }>> => {
  try {
    console.log('📤 Supabase Signup Request:', data);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error(
        'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file'
      );
    }

    const siteOrigin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : undefined);
    const redirectTo = siteOrigin
      ? `${siteOrigin.replace(/\/$/, '')}/auth/callback?portal=${userType}`
      : undefined;

    // 1️⃣ Signup with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          name: data.name,
          phone: data.phone,
        },
      },
    });

    if (authError) {
      console.error('❌ Supabase Signup Error:', authError);
      throw new Error(authError.message);
    }

    const accessToken = authData.session?.access_token;

    // If Supabase requires email confirmation, there may be no session yet
    if (!accessToken) {
      return {
        success: true,
        data: { user: {} as User, token: '' },
        message: 'Please check your email to confirm your account',
      };
    }

    console.log('✅ Supabase signup successful');

    // 2️⃣ Sync with backend (backend sets HttpOnly auth_token cookie)
    const syncResponse = await apiClient.post(
      '/auth/sync',
      {
        userType,
        email: data.email,
        name: data.name,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Supabase-Token': accessToken,
        },
      }
    );

    console.log('📥 Backend Sync Response:', syncResponse.data);

    // 3️⃣ Extract user only
    let userData: User;

    if (syncResponse.data?.data?.user) {
      userData = syncResponse.data.data.user;
    } else if (syncResponse.data?.user) {
      userData = syncResponse.data.user;
    } else {
      console.error('❌ Invalid sync response format:', syncResponse.data);
      throw new Error('Invalid sync response format: missing user');
    }

    return {
      success: true,
      data: {
        token: accessToken,
        user: userData,
      },
      message: 'Account created successfully',
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.error('❌ Supabase Signup Error:', error);

    return {
      success: false,
      data: { user: {} as User, token: '' },
      error:
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        (error as Error).message ||
        'Signup failed',
    };
  }
},


  // Login (Legacy method - kept for backward compatibility)
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
      
      // ✅ Handle both nested and flat response structures
      let tokenData: string;
      let userData: User;
      
      if (response.data.data) {
        // Format: { success: true, data: { token, user } }
        tokenData = response.data.data.token;
        userData = response.data.data.user;
      } else if (response.data.token) {
        // Format: { token, user } (flat structure)
        tokenData = response.data.token;
        userData = response.data.user;
      } else {
        throw new Error('Invalid response format: missing token or user data');
      }
      
      // Save token
      Cookies.set('auth_token', tokenData, { expires: 7 });
      
      return {
        success: true,
        data: {
          token: tokenData,
          user: userData,
        },
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

// Upload API for medical documents
export const uploadApi = {
  // Upload file for a patient
  uploadFile: async (
    patientId: string,
    type: string,
    file: File
  ): Promise<ApiResponse<{ key: string; filename: string; url: string; size: number }>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Upload Request:', { patientId, type, filename: file.name });

      const response = await apiClient.post(`/upload/${patientId}/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('📥 Upload Response:', response.data);

      return {
        success: true,
        data: response.data,
        message: 'File uploaded successfully',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error('❌ Upload Error:', axiosError.response?.data || axiosError.message);

      return {
        success: false,
        data: { key: '', filename: '', url: '', size: 0 },
        error: axiosError.response?.data?.message
          || axiosError.response?.data?.error
          || axiosError.message
          || 'Upload failed',
      };
    }
  },

  // List files for a patient
  listFiles: async (patientId: string): Promise<ApiResponse<Array<{ key: string; filename: string; url: string; size: number }>>> => {
    try {
      console.log('📤 List Files Request:', { patientId });

      const response = await apiClient.get(`/upload/${patientId}`);

      console.log('📥 List Files Response:', response.data);

      return {
        success: true,
        data: response.data,
        message: 'Files retrieved successfully',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error('❌ List Files Error:', axiosError.response?.data || axiosError.message);

      return {
        success: false,
        data: [],
        error: axiosError.response?.data?.message
          || axiosError.response?.data?.error
          || axiosError.message
          || 'Failed to retrieve files',
      };
    }
  },
};

// Patient API for verification
export const patientApi = {
  // Verify patient by ID
  verifyPatient: async (
    patientId: string
  ): Promise<ApiResponse<{ id: string; name: string; age: number; gender: string; email?: string; phone?: string }>> => {
    try {
      console.log('📤 Verify Patient Request:', { patientId });

      const response = await apiClient.get(`/patients/${patientId}`);

      console.log('📥 Verify Patient Response:', response.data);

      // Handle both nested and flat response structures
      let patientData;
      
      if (response.data.data) {
        // Format: { success: true, data: { patient } }
        patientData = response.data.data;
      } else {
        // Format: { id, name, age, gender, ... } (flat structure)
        patientData = response.data;
      }

      return {
        success: true,
        data: patientData,
        message: 'Patient verified successfully',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error('❌ Verify Patient Error:', axiosError.response?.data || axiosError.message);

      return {
        success: false,
        data: { id: '', name: '', age: 0, gender: '' },
        error: axiosError.response?.data?.message
          || axiosError.response?.data?.error
          || axiosError.message
          || 'Patient not found',
      };
    }
  },
  // Dashboard aggregation: counts + latest record
  getDashboard: async (
    patientId: string
  ): Promise<ApiResponse<{ counts: { appointmentsUpcoming: number; alertsActive: number; reportsRecent: number }; latestRecord?: { id: string; type: string; date?: string; findings?: string; status?: string } }>> => {
    try {
      const response = await apiClient.get(`/patients/${patientId}/dashboard`);
      const data = response.data?.data ?? response.data;
      return {
        success: true,
        data,
        message: 'OK',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return {
        success: false,
        data: { counts: { appointmentsUpcoming: 0, alertsActive: 0, reportsRecent: 0 } } as any,
        error:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          (error as Error).message ||
          'Failed to fetch dashboard',
      };
    }
  },
  // List medical records (timeline/reports)
  listRecords: async (
    patientId: string,
    params?: { type?: string; from?: string; to?: string; limit?: number }
  ): Promise<ApiResponse<
    Array<{ id: string; type: string; date: string; doctor?: string; clinic?: string; findings?: string; status?: string; fileUrl?: string; filename?: string; size?: number; fileKey?: string }>
  >> => {
    try {
      const response = await apiClient.get(`/patients/${patientId}/records`, { params });
      const data = response.data?.data ?? response.data;
      return {
        success: true,
        data,
        message: 'OK',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return {
        success: false,
        data: [],
        error:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          (error as Error).message ||
          'Failed to fetch records',
      };
    }
  },
  // Alerts for a patient
  getAlerts: async (
    patientId: string
  ): Promise<ApiResponse<
    Array<{
      id: string;
      type: string;
      title?: string;
      summary?: string;
      details?: string;
      date: string;
    }>
  >> => {
    try {
      const response = await apiClient.get(`/patients/${patientId}/alerts`);
      const data = response.data?.data ?? response.data;
      return {
        success: true,
        data,
        message: 'OK',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return {
        success: false,
        data: [],
        error:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          (error as Error).message ||
          'Failed to fetch alerts',
      };
    }
  },
  // Sync S3 files into DB-backed medical records
  syncRecords: async (
    patientId: string
  ): Promise<ApiResponse<{ imported: number }>> => {
    try {
      const response = await apiClient.post(`/patients/${patientId}/records/sync`);
      const data = response.data?.data ?? response.data;
      return {
        success: true,
        data,
        message: 'Synced successfully',
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return {
        success: false,
        data: { imported: 0 } as any,
        error:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          (error as Error).message ||
          'Failed to sync records',
      };
    }
  },
};
