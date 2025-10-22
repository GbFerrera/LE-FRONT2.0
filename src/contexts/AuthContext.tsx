'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthManager, User } from '@/lib/auth';
import { apiService, AuthResponse } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = AuthManager.getUser();
      const token = AuthManager.getToken();
      
      if (savedUser && token) {
        setUser(savedUser);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ email, password });
      
      // Salvar dados de autenticação
      if (response.client) {
        AuthManager.saveAuth(response.token, response.client);
        setUser(response.client);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Chamar API de logout com o token
      const token = AuthManager.getToken();
      if (token) {
        await apiService.logout(token);
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro na API, limpar dados locais
    } finally {
      // Limpar dados de autenticação
      AuthManager.clearAuth();
      setUser(null);
      setIsLoading(false);
    }
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};