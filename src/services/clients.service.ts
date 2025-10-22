import api from './api';

export interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  document?: string;
  email: string;
  company_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateClientDTO {
  name: string;
  phone: string;
  address: string;
  document?: string;
  email: string;
}

export interface UpdateClientDTO {
  name?: string;
  phone?: string;
  address?: string;
  document?: string;
  email?: string;
}

class ClientsService {
  // Company ID fixo
  private readonly companyId: string = "2";

  // Pegar o company_id fixo
  getCompanyId(): string {
    return this.companyId;
  }

  // Listar todos os clientes
  async getAll(term?: string): Promise<Client[]> {
    const companyId = this.getCompanyId();
    const response = await api.get('/clients', {
      headers: {
        company_id: companyId,
      },
      params: term ? { term } : {},
    });
    return response.data;
  }

  // Buscar cliente por ID
  async getById(id: number): Promise<Client> {
    const companyId = this.getCompanyId();
    const response = await api.get(`/clients/${id}`, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data;
  }

  // Buscar cliente por documento
  async getByDocument(document: string): Promise<Client> {
    const companyId = this.getCompanyId();
    const response = await api.get(`/clients/document/${document}`, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data;
  }

  // Buscar cliente por telefone
  async getByPhone(phone: string): Promise<Client> {
    const companyId = this.getCompanyId();
    const response = await api.get(`/clients/phone/${phone}`, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data;
  }

  // Criar novo cliente
  async create(data: CreateClientDTO): Promise<Client> {
    const companyId = this.getCompanyId();
    const response = await api.post('/clients', data, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data;
  }

  // Atualizar cliente
  async update(id: number, data: UpdateClientDTO): Promise<Client> {
    const companyId = this.getCompanyId();
    const response = await api.put(`/clients/${id}`, data, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data.client || response.data;
  }

  // Deletar cliente
  async delete(id: number): Promise<void> {
    const companyId = this.getCompanyId();
    await api.delete(`/clients/${id}`, {
      headers: {
        company_id: companyId,
      },
    });
  }
}

export default new ClientsService();
