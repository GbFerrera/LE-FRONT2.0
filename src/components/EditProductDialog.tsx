"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import productsService, { UpdateProductDTO } from "@/services/products.service";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  productId: number | null;
  categories: string[];
}

export function EditProductDialog({
  open,
  onOpenChange,
  onSuccess,
  productId,
  categories,
}: EditProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [formData, setFormData] = useState<UpdateProductDTO>({
    name: "",
    price: 0,
    category: "",
    notes: "",
    size: false,
  });

  useEffect(() => {
    if (open && productId) {
      loadProductData();
    }
  }, [open, productId]);

  const loadProductData = async () => {
    if (!productId) return;
    
    try {
      setLoadingData(true);
      const product = await productsService.getById(productId);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        notes: product.notes || "",
        size: product.size || false,
      });
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
      alert("Erro ao carregar dados do produto");
      onOpenChange(false);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) return;
    
    if (!formData.name || !formData.price || !formData.category) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (formData.price && formData.price <= 0) {
      alert("O preço deve ser maior que zero");
      return;
    }

    try {
      setLoading(true);
      await productsService.update(productId, formData);
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      alert(error.response?.data?.message || "Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateProductDTO, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Atualize os dados do produto. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        
        {loadingData ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando dados...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">
                  Nome do Produto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Ex: Hambúrguer Clássico"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-price">
                  Preço <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ""}
                  onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-category">
                  Categoria <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Observações</Label>
                <Input
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Informações adicionais sobre o produto"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-size"
                  checked={formData.size}
                  onCheckedChange={(checked: boolean) => handleChange("size", checked)}
                  disabled={loading}
                />
                <Label
                  htmlFor="edit-size"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Produto com tamanhos/variações
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
