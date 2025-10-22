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
import professionalsService, { CreateProfessionalDTO } from "@/services/professionals.service";

interface CreateProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateProfessionalDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateProfessionalDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProfessionalDTO>({
    name: "",
    email: "",
    password: "",
    position: "",
    phone_number: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.position) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      await professionalsService.create(formData);
      
      // Resetar formulário
      setFormData({
        name: "",
        email: "",
        password: "",
        position: "",
        phone_number: "",
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao criar profissional:", error);
      alert(error.response?.data?.message || "Erro ao criar profissional");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateProfessionalDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo profissional. Campos marcados com * são obrigatórios.
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
              <Label htmlFor="password">
                Senha <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">
                Cargo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                placeholder="Ex: Gerente, Cozinheiro, Atendente"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone_number">Telefone</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                placeholder="(11) 98765-4321"
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
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
