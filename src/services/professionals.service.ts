import api from './api';

export interface Professional {
  id: number;
  name: string;
  email: string;
  position: string;
  phone_number: string;
  company_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProfessionalDTO {
  name: string;
  email: string;
  password: string;
  position: string;
  phone_number?: string;
}

export interface UpdateProfessionalDTO {
  name?: string;
  email?: string;
  password?: string;
  position?: string;
  phone_number?: string;
}

class ProfessionalsService {
  // Company ID fixo
  private readonly companyId: string = "2";

  // Pegar o company_id fixo
  getCompanyId(): string {
    return this.companyId;
  }

  // Listar todos os profissionais
  async getAll(term?: string): Promise<Professional[]> {
    const companyId = this.getCompanyId();
    const response = await api.get('/professionals', {
      headers: {
        company_id: companyId,
      },
      params: term ? { term } : {},
    });
    return response.data;
  }

  // Buscar profissional por ID
  async getById(id: number): Promise<Professional> {
    const companyId = this.getCompanyId();
    const response = await api.get(`/professionals/${id}`, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data;
  }

  // Criar novo profissional
  async create(data: CreateProfessionalDTO): Promise<Professional> {
    const companyId = this.getCompanyId();
    const response = await api.post('/professionals', data, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data;
  }

  // Atualizar profissional
  async update(id: number, data: UpdateProfessionalDTO): Promise<Professional> {
    const companyId = this.getCompanyId();
    const response = await api.put(`/professionals/${id}`, data, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data.user || response.data;
  }

  // Deletar profissional
  async delete(id: number): Promise<void> {
    const companyId = this.getCompanyId();
    await api.delete(`/professionals/${id}`, {
      headers: {
        company_id: companyId,
      },
    });
  }
}

export default new ProfessionalsService();
