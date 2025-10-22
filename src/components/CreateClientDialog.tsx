"use client";

import { useState } from "react";
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
import clientsService, { CreateClientDTO } from "@/services/clients.service";

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateClientDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateClientDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateClientDTO>({
    name: "",
    phone: "",
    address: "",
    document: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      await clientsService.create(formData);
      
      // Resetar formulário
      setFormData({
        name: "",
        phone: "",
        address: "",
        document: "",
        email: "",
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao criar cliente:", error);
      alert(error.response?.data?.message || "Erro ao criar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateClientDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo cliente. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Digite o nome completo"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@exemplo.com"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">
                Telefone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(11) 98765-4321"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">
                Endereço <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Rua, número, bairro, cidade"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="document">Documento (CPF/CNPJ)</Label>
              <Input
                id="document"
                value={formData.document}
                onChange={(e) => handleChange("document", e.target.value)}
                placeholder="000.000.000-00"
                disabled={loading}
              />
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
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? "Criando..." : "Criar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
