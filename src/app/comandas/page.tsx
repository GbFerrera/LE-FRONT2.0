"use client";

import { Plus, Search, Clock, Users, DollarSign } from "lucide-react";
import { useState } from "react";

interface Command {
  id: string;
  table: number;
  client: string;
  items: number;
  total: number;
  startTime: string;
  duration: string;
}

export default function ComandasPage() {
  const [commands] = useState<Command[]>([
    {
      id: "CMD001",
      table: 2,
      client: "Maria Santos",
      items: 5,
      total: 125.5,
      startTime: "14:30",
      duration: "1h 30min",
    },
    {
      id: "CMD002",
      table: 5,
      client: "Pedro Costa",
      items: 3,
      total: 89.0,
      startTime: "15:15",
      duration: "45min",
    },
    {
      id: "CMD003",
      table: 8,
      client: "Ana Oliveira",
      items: 7,
      total: 210.0,
      startTime: "13:45",
      duration: "2h 15min",
    },
    {
      id: "CMD004",
      table: 10,
      client: "Carlos Lima",
      items: 4,
      total: 156.75,
      startTime: "14:00",
      duration: "2h",
    },
  ]);

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Gestão de Comandas
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Acompanhe todas as comandas ativas em tempo real.
          </p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors">
          <Plus className="h-5 w-5" />
          Nova Comanda
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
        <input
          type="text"
          placeholder="Buscar comanda..."
          className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
            <Users className="h-5 w-5" />
            Comandas Ativas
          </div>
          <p className="text-4xl font-bold text-neutral-900 dark:text-white">
            {commands.length}
          </p>
        </div>
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
            <Clock className="h-5 w-5" />
            Tempo Médio
          </div>
          <p className="text-4xl font-bold text-neutral-900 dark:text-white">
            1h 30m
          </p>
        </div>
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-2">
            <DollarSign className="h-5 w-5" />
            Total
          </div>
          <p className="text-4xl font-bold text-neutral-900 dark:text-white">
            R$ 581
          </p>
        </div>
      </div>

      {/* Commands List */}
      <div className="space-y-4">
        {commands.map((command) => (
          <div
            key={command.id}
            className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-orange-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {command.id}
                  </h3>
                  <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                    Mesa {command.table}
                  </span>
                </div>
                <p className="text-neutral-900 dark:text-white font-medium">
                  {command.client}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {command.items} {command.items === 1 ? "item" : "itens"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  R$ {command.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Início: {command.startTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Duração: {command.duration}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                  Ver Detalhes
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}