"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import productsService, { Product } from "@/services/products.service";
import { CreateProductDialog } from "@/components/CreateProductDialog";
import { EditProductDialog } from "@/components/EditProductDialog";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll(
        undefined,
        selectedCategory !== "Todos" ? selectedCategory : undefined
      );
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await productsService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    
    try {
      await productsService.delete(id);
      await loadProducts();
      await loadCategories();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto");
    }
  };

  const handleEdit = (id: number) => {
    setSelectedProductId(id);
    setEditDialogOpen(true);
  };

  const handleSuccess = () => {
    loadProducts();
    loadCategories();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Dialogs */}
      <CreateProductDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleSuccess}
        categories={categories}
      />
      
      <EditProductDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleSuccess}
        productId={selectedProductId}
        categories={categories}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Controle de Produtos e Estoque
        </h1>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          Adicionar Produto
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-neutral-600 dark:text-neutral-400">
          Filtrar por Categoria:
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
            Lista de Produtos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Nome do Produto
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-600 dark:text-neutral-400">
                      Carregando...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-600 dark:text-neutral-400">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-200 dark:border-neutral-700/50 last:border-0 hover:bg-neutral-200 dark:hover:bg-neutral-700/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm text-neutral-900 dark:text-white font-medium">
                        #{product.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-neutral-900 dark:text-white font-medium">
                            {product.name}
                          </span>
                          {product.notes && (
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">
                              {product.notes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-neutral-600 dark:text-neutral-300">
                        {product.category}
                      </td>
                      <td className="py-4 px-4 text-sm text-neutral-900 dark:text-white font-medium">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product.id)}
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
