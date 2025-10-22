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
import clientsService, { Client, UpdateClientDTO } from "@/services/clients.service";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  clientId: number | null;
}

export function EditClientDialog({
  open,
  onOpenChange,
  onSuccess,
  clientId,
}: EditClientDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [formData, setFormData] = useState<UpdateClientDTO>({
    name: "",
    phone: "",
    address: "",
    document: "",
    email: "",
  });

  useEffect(() => {
    if (open && clientId) {
      loadClientData();
    }
  }, [open, clientId]);

  const loadClientData = async () => {
    if (!clientId) return;
    
    try {
      setLoadingData(true);
      const client = await clientsService.getById(clientId);
      setFormData({
        name: client.name,
        phone: client.phone,
        address: client.address,
        document: client.document || "",
        email: client.email,
      });
    } catch (error) {
      console.error("Erro ao carregar cliente:", error);
      alert("Erro ao carregar dados do cliente");
      onOpenChange(false);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId) return;
    
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      await clientsService.update(clientId, formData);
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao atualizar cliente:", error);
      alert(error.response?.data?.message || "Erro ao atualizar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateClientDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize os dados do cliente. Campos marcados com * são obrigatórios.
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
                <Label htmlFor="edit-phone">
                  Telefone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="(11) 98765-4321"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-address">
                  Endereço <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Rua, número, bairro, cidade"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-document">Documento (CPF/CNPJ)</Label>
                <Input
                  id="edit-document"
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
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
