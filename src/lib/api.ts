const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  client?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    document?: string;
    company_id: number;
    created_at: string;
    updated_at: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    document?: string;
    company_id: number;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ApiResponse {
  message: string;
}

class ApiService {
  private getHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro de conexão' }));
      throw new Error(errorData.message || 'Email ou senha incorretos');
    }

    const result = await response.json();
    
    return {
      client: result.client,
      user: result.user,
      token: result.token
    };
  }

  async logout(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro de conexão' }));
      throw new Error(errorData.message || 'Erro ao fazer logout');
    }
  }

  async requestPasswordReset(data: ForgotPasswordRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/sessions/request-password-reset`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro de conexão' }));
      throw new Error(errorData.message || 'Erro ao solicitar recuperação de senha');
    }

    return await response.json();
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/sessions/reset-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro de conexão' }));
      throw new Error(errorData.message || 'Erro ao resetar senha');
    }

    return await response.json();
  }
}

export const apiService = new ApiService();