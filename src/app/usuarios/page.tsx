"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, UserPlus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import professionalsService, { Professional } from "@/services/professionals.service";
import { CreateProfessionalDialog } from "@/components/CreateProfessionalDialog";
import { EditProfessionalDialog } from "@/components/EditProfessionalDialog";


export default function Usuarios() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [cargoFilter, setCargoFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);

  // Carregar profissionais do backend
  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const data = await professionalsService.getAll(searchTerm);
      setProfessionals(data);
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
    } finally {
      setLoading(false);
    }
  };

  // Deletar profissional
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este profissional?")) return;
    
    try {
      await professionalsService.delete(id);
      await loadProfessionals();
    } catch (error) {
      console.error("Erro ao deletar profissional:", error);
      alert("Erro ao deletar profissional");
    }
  };

  // Editar profissional
  const handleEdit = (id: number) => {
    setSelectedProfessionalId(id);
    setEditDialogOpen(true);
  };

  // Filtrar profissionais
  const filteredProfessionals = professionals.filter((prof) => {
    if (cargoFilter !== "all" && prof.position !== cargoFilter) return false;
    return true;
  });

  // Buscar cargos únicos para o filtro
  const uniquePositions = Array.from(
    new Set(professionals.map((p) => p.position))
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-orange-500/50 text-orange-700";
      case "Inativo":
        return "bg-red-500/50 text-red-700";
      default:
        return "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-background">
      {/* Título */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Gestão de Usuários</h1>
      </div>

      {/* Filtros e Ações */}
      <div className="flex items-center justify-between">
        {/* Left side - Filters */}
        <div className="flex gap-3">
          <Select value={cargoFilter} onValueChange={setCargoFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Cargos</SelectItem>
              {uniquePositions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar Usuário
          </Button>
          <Button variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Editar Permissões
          </Button>
        </div>
      </div>
      
      {/* Dialog de Criar Profissional */}
      <CreateProfessionalDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={loadProfessionals}
      />

      {/* Dialog de Editar Profissional */}
      <EditProfessionalDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={loadProfessionals}
        professionalId={selectedProfessionalId}
      />

      {/* Card with Table */}
      <Card className="overflow-hidden">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">NOME</TableHead>
                <TableHead className="font-semibold">CARGO</TableHead>
                <TableHead className="font-semibold">TELEFONE</TableHead>
                <TableHead className="font-semibold">STATUS</TableHead>
                <TableHead className="font-semibold text-right">AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredProfessionals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum profissional encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfessionals.map((professional) => (
                  <TableRow key={professional.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(professional.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{professional.name}</span>
                          <span className="text-xs text-muted-foreground">{professional.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {professional.position}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {professional.phone_number || "-"}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">Ativo</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(professional.id)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(professional.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}