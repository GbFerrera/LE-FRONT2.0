"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import clientsService, { Client } from "@/services/clients.service";
import { CreateClientDialog } from "@/components/CreateClientDialog";
import { EditClientDialog } from "@/components/EditClientDialog";


export default function Clientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsService.getAll(searchTerm);
      setClients(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    
    try {
      await clientsService.delete(id);
      await loadClients();
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      alert("Erro ao deletar cliente");
    }
  };

  const handleEdit = (id: number) => {
    setSelectedClientId(id);
    setEditDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-foreground">Clientes</h1>
        <Button 
          className="gap-2 bg-orange-600 hover:bg-orange-700"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Adicionar Cliente
        </Button>
      </div>

      {/* Dialogs */}
      <CreateClientDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={loadClients}
      />
      
      <EditClientDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={loadClients}
        clientId={selectedClientId}
      />

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Card with Table */}
      <Card className="overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-xl font-semibold">Lista de Clientes</h2>
        </div>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Nome</TableHead>
                <TableHead className="font-semibold">Telefone</TableHead>
                <TableHead className="font-semibold text-center">
                  Número de Pedidos
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Total Gasto
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{client.name}</span>
                        <span className="text-xs text-muted-foreground">{client.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.phone}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      -
                    </TableCell>
                    <TableCell className="text-center font-medium text-muted-foreground">
                      -
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                          onClick={() => handleEdit(client.id)}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                          onClick={() => handleDelete(client.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
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