import api from './api';

export interface ProductPhoto {
  id: number;
  filename: string;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  notes?: string;
  size: boolean;
  company_id: number;
  created_at: string;
  updated_at: string;
  photos?: ProductPhoto[];
}

export interface CreateProductDTO {
  name: string;
  price: number;
  category: string;
  notes?: string;
  size?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  category?: string;
  notes?: string;
  size?: boolean;
}

class ProductsService {
  // Company ID fixo
  private readonly companyId: string = "2";

  // Pegar o company_id fixo
  getCompanyId(): string {
    return this.companyId;
  }

  // Listar todos os produtos
  async getAll(term?: string, category?: string): Promise<Product[]> {
    const companyId = this.getCompanyId();
    const params: any = {};
    if (term) params.term = term;
    if (category && category !== "Todos") params.category = category;

    const response = await api.get('/products', {
      headers: {
        company_id: companyId,
      },
      params,
    });
    return response.data;
  }

  // Buscar produto por ID
  async getById(id: number): Promise<Product> {
    const companyId = this.getCompanyId();
    const response = await api.get(`/products/${id}`, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data;
  }

  // Buscar categorias
  async getCategories(): Promise<string[]> {
    const companyId = this.getCompanyId();
    const response = await api.get('/products/categories', {
      headers: {
        company_id: companyId,
      },
    });
    return response.data;
  }

  // Criar novo produto
  async create(data: CreateProductDTO): Promise<Product> {
    const companyId = this.getCompanyId();
    const response = await api.post('/products', data, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data;
  }

  // Atualizar produto
  async update(id: number, data: UpdateProductDTO): Promise<Product> {
    const companyId = this.getCompanyId();
    const response = await api.put(`/products/${id}`, data, {
      headers: {
        company_id: companyId,
      },
    });
    return response.data.product || response.data;
  }

  // Deletar produto
  async delete(id: number): Promise<void> {
    const companyId = this.getCompanyId();
    await api.delete(`/products/${id}`, {
      headers: {
        company_id: companyId,
      },
    });
  }
}

export default new ProductsService();
