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
import professionalsService, { Professional, UpdateProfessionalDTO } from "@/services/professionals.service";

interface EditProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  professionalId: number | null;
}

export function EditProfessionalDialog({
  open,
  onOpenChange,
  onSuccess,
  professionalId,
}: EditProfessionalDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [formData, setFormData] = useState<UpdateProfessionalDTO>({
    name: "",
    email: "",
    password: "",
    position: "",
    phone_number: "",
  });

  useEffect(() => {
    if (open && professionalId) {
      loadProfessionalData();
    }
  }, [open, professionalId]);

  const loadProfessionalData = async () => {
    if (!professionalId) return;
    
    try {
      setLoadingData(true);
      const professional = await professionalsService.getById(professionalId);
      setFormData({
        name: professional.name,
        email: professional.email,
        password: "", // Não carregar senha por segurança
        position: professional.position,
        phone_number: professional.phone_number || "",
      });
    } catch (error) {
      console.error("Erro ao carregar profissional:", error);
      alert("Erro ao carregar dados do profissional");
      onOpenChange(false);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!professionalId) return;
    
    if (!formData.name || !formData.email || !formData.position) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      
      // Se a senha estiver vazia, não enviar no update
      const updateData: UpdateProfessionalDTO = {
        name: formData.name,
        email: formData.email,
        position: formData.position,
        phone_number: formData.phone_number,
      };
      
      // Só incluir senha se foi preenchida
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }
      
      await professionalsService.update(professionalId, updateData);
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao atualizar profissional:", error);
      alert(error.response?.data?.message || "Erro ao atualizar profissional");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateProfessionalDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Profissional</DialogTitle>
          <DialogDescription>
            Atualize os dados do profissional. Campos marcados com * são obrigatórios.
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
                  Nome <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Digite o nome completo"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@exemplo.com"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-password">
                  Nova Senha (deixe em branco para não alterar)
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-position">
                  Cargo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-position"
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  placeholder="Ex: Gerente, Cozinheiro, Atendente"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-phone_number">Telefone</Label>
                <Input
                  id="edit-phone_number"
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
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
