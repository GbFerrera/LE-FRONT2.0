"use client";

import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function Home() {
  // Dados do dashboard
  const stats = [
    {
      title: "Pedidos do dia",
      value: "124",
      change: "+12.5% desde ontem passado",
      icon: ShoppingCart,
      trend: "up",
    },
    {
      title: "Vendas totais",
      value: "R$ 7.850,00",
      change: "+8.1% desde a semana passada",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Clientes ativos",
      value: "2.450",
      change: "+1.2% desde o mês passado",
      icon: Users,
      trend: "up",
    },
    {
      title: "Itens em estoque",
      value: "1.580",
      change: "+3.05% última semana",
      icon: Package,
      trend: "up",
    },
  ];

  const monthlyOrders = [
    { month: "Jan", orders: 200 },
    { month: "Fev", orders: 320 },
    { month: "Mar", orders: 240 },
    { month: "Abr", orders: 280 },
    { month: "Mai", orders: 310 },
    { month: "Jun", orders: 300 },
    { month: "Jul", orders: 350 },
    { month: "Ago", orders: 320 },
    { month: "Set", orders: 380 },
    { month: "Out", orders: 310 },
    { month: "Nov", orders: 400 },
    { month: "Dez", orders: 360 },
  ];

  const recentOrders = [
    {
      id: "PED001",
      client: "João Silva",
      total: "R$ 85,50",
      status: "Concluído",
      date: "2024-07-28 14:30",
    },
    {
      id: "PED002",
      client: "Maria Oliveira",
      total: "R$ 120,00",
      status: "Pendente",
      date: "2024-07-28 15:15",
    },
    {
      id: "PED003",
      client: "Carlos Souza",
      total: "R$ 55,00",
      status: "Concluído",
      date: "2024-07-27 19:00",
    },
    {
      id: "PED004",
      client: "Ana Costa",
      total: "R$ 210,99",
      status: "Concluído",
      date: "2024-07-27 18:45",
    },
    {
      id: "PED005",
      client: "Pedro Santos",
      total: "R$ 42,00",
      status: "Cancelado",
      date: "2024-07-27 17:00",
    },
  ];

  const maxOrders = Math.max(...monthlyOrders.map((m) => m.orders));

  // Função para obter saudação
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Função para formatar data
  const getFormattedDate = () => {
    const date = new Date();
    const days = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ];
    const months = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          {getGreeting()}, João!
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {getFormattedDate()}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 space-y-3 border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {stat.title}
                </span>
                <Icon className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Pedidos por Mês
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Visão geral dos pedidos recebidos mensalmente.
            </p>
          </div>
          <div className="flex items-end justify-between gap-2 h-64 pt-4">
            {monthlyOrders.map((data) => (
              <div
                key={data.month}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div className="w-full flex items-end justify-center h-48">
                  <div
                    className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600"
                    style={{
                      height: `${(data.orders / maxOrders) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  {data.month}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span>Total de Pedidos</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Pedidos Recentes
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Lista dos últimos pedidos com seus status atuais.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                    ID do Pedido
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                    Valor Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-neutral-200 dark:border-neutral-700 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                  >
                    <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white font-medium">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white">
                      {order.client}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white">
                      {order.total}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Concluído"
                            ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white"
                            : order.status === "Pendente"
                              ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"
                              : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
