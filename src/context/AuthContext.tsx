import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../services/api';

interface User {
  _id: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  login: (name: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

// Axios instance for auth
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Needed for sending cookies
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const csrfToken = localStorage.getItem('X-CSRF-Token');
      try {
        const response = await apiClient.get('/api/admin/me', {
          headers: {
            'X-CSRF-Token': csrfToken || '',
          },
        });
        setUser(response.data);
        setIsAuthenticated(true);
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.warn('Not authenticated:', error);
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (name: string, password: string) => {
    try {
      const response = await apiClient.post('/api/admin/login', { name, password });

      // ✅ Save CSRF token from response headers
      const csrfToken = response.headers['x-csrf-token'] || response.headers['X-CSRF-Token'];
      console.log(csrfToken)
      if (csrfToken) {
        localStorage.setItem('X-CSRF-Token', csrfToken);
      }

      setUser(response.data);
      setIsAuthenticated(true);
      setIsAdmin(response.data.isAdmin);
      return { success: true };
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err?.response?.data?.message || 'Login failed';
      return {
        success: false,
        message,
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/admin/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('X-CSRF-Token');
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
