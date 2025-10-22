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
import productsService, { CreateProductDTO } from "@/services/products.service";

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  categories: string[];
}

export function CreateProductDialog({
  open,
  onOpenChange,
  onSuccess,
  categories,
}: CreateProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProductDTO>({
    name: "",
    price: 0,
    category: "",
    notes: "",
    size: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (formData.price <= 0) {
      alert("O preço deve ser maior que zero");
      return;
    }

    try {
      setLoading(true);
      await productsService.create(formData);
      
      // Resetar formulário
      setFormData({
        name: "",
        price: 0,
        category: "",
        notes: "",
        size: false,
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      alert(error.response?.data?.message || "Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateProductDTO, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo produto. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nome do Produto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ex: Hambúrguer Clássico"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">
                Preço <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
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
              <Label htmlFor="category">
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
                  <SelectItem value="nova">+ Nova Categoria</SelectItem>
                </SelectContent>
              </Select>
              {formData.category === "nova" && (
                <Input
                  placeholder="Digite o nome da nova categoria"
                  onChange={(e) => handleChange("category", e.target.value)}
                  disabled={loading}
                />
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Informações adicionais sobre o produto"
                disabled={loading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="size"
                checked={formData.size}
                onCheckedChange={(checked: boolean) => handleChange("size", checked)}
                disabled={loading}
              />
              <Label
                htmlFor="size"
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
              {loading ? "Criando..." : "Criar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
