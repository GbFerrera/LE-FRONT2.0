"use client";

import { Plus, X, Minus, Trash2 } from "lucide-react";
import { useState } from "react";

type TableStatus = "livre" | "ocupada" | "reservada";

interface Table {
  id: number;
  status: TableStatus;
  occupiedSince?: string;
  reservation?: {
    name: string;
    time: string;
  };
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderDetails {
  tableId: number;
  commandId: string;
  client: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export default function MesasPage() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [tables] = useState<Table[]>([
    { id: 1, status: "livre" },
    { id: 2, status: "ocupada", occupiedSince: "14:30" },
    {
      id: 3,
      status: "reservada",
      reservation: { name: "João Silva", time: "19:00" },
    },
    { id: 4, status: "livre" },
    { id: 5, status: "ocupada", occupiedSince: "14:30" },
    { id: 6, status: "livre" },
    {
      id: 7,
      status: "reservada",
      reservation: { name: "João Silva", time: "19:00" },
    },
    { id: 8, status: "ocupada", occupiedSince: "14:30" },
    { id: 9, status: "livre" },
    { id: 10, status: "ocupada", occupiedSince: "14:30" },
    { id: 11, status: "livre" },
    {
      id: 12,
      status: "reservada",
      reservation: { name: "João Silva", time: "19:00" },
    },
    { id: 13, status: "livre" },
    { id: 14, status: "ocupada", occupiedSince: "14:30" },
    { id: 15, status: "livre" },
    {
      id: 16,
      status: "reservada",
      reservation: { name: "João Silva", time: "19:00" },
    },
  ]);

  const [orderDetails] = useState<Record<number, OrderDetails>>({
    2: {
      tableId: 2,
      commandId: "CMD001",
      client: "Maria Santos",
      items: [
        { id: "1", name: "Big Mac", price: 25.99, quantity: 1, image: "🍔" },
        { id: "2", name: "Big Burg", price: 22.69, quantity: 1, image: "🍔" },
        { id: "3", name: "Batata Frita", price: 12.50, quantity: 2, image: "🍟" },
      ],
      subtotal: 73.68,
      tax: 7.37,
      total: 81.05,
    },
    5: {
      tableId: 5,
      commandId: "CMD002",
      client: "Pedro Costa",
      items: [
        { id: "1", name: "Hambúrguer Clássico", price: 25.99, quantity: 1, image: "🍔" },
        { id: "2", name: "Coca-Cola", price: 8.00, quantity: 2, image: "🥤" },
      ],
      subtotal: 41.99,
      tax: 4.20,
      total: 46.19,
    },
    8: {
      tableId: 8,
      commandId: "CMD003",
      client: "Ana Oliveira",
      items: [
        { id: "1", name: "Pizza Calabresa", price: 45.00, quantity: 1, image: "🍕" },
        { id: "2", name: "Pizza Marguerita", price: 42.00, quantity: 1, image: "🍕" },
        { id: "3", name: "Refrigerante", price: 8.00, quantity: 2, image: "🥤" },
      ],
      subtotal: 103.00,
      tax: 10.30,
      total: 113.30,
    },
    10: {
      tableId: 10,
      commandId: "CMD004",
      client: "Carlos Lima",
      items: [
        { id: "1", name: "Double Big", price: 32.10, quantity: 1, image: "🍔" },
        { id: "2", name: "Batata Frita Grande", price: 15.00, quantity: 1, image: "🍟" },
        { id: "3", name: "Milkshake", price: 18.00, quantity: 1, image: "🥤" },
      ],
      subtotal: 65.10,
      tax: 6.51,
      total: 71.61,
    },
  });

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "livre":
        return "bg-green-500";
      case "ocupada":
        return "bg-orange-500";
      case "reservada":
        return "bg-yellow-500";
    }
  };

  const getTableBgColor = (status: TableStatus) => {
    switch (status) {
      case "livre":
        return "bg-neutral-900 dark:bg-neutral-900";
      case "ocupada":
        return "bg-orange-900/60 dark:bg-orange-900/60";
      case "reservada":
        return "bg-yellow-900/60 dark:bg-yellow-900/60";
    }
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Tables Section */}
      <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Gestão de Mesas
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Visualize e gerencie o status das mesas do seu restaurante em
              tempo real.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400 font-semibold">
              Legenda:
            </span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-neutral-900 dark:text-white">Livre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-neutral-900 dark:text-white">Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-neutral-900 dark:text-white">
                Reservada
              </span>
            </div>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`${getTableBgColor(table.status)} rounded-xl p-4 border border-neutral-700 space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">
                    Mesa {table.id}
                  </h3>
                  <span
                    className={`${getStatusColor(table.status)} text-white text-xs px-3 py-1 rounded-full font-medium`}
                  >
                    {table.status === "livre" && "Livre"}
                    {table.status === "ocupada" && "Ocupada"}
                    {table.status === "reservada" && "Reservada"}
                  </span>
                </div>

                {table.status === "ocupada" && table.occupiedSince && (
                  <p className="text-white text-sm">
                    Ocupada desde: {table.occupiedSince}
                  </p>
                )}

                {table.status === "reservada" && table.reservation && (
                  <p className="text-white text-sm">
                    Reserva para: {table.reservation.name} (
                    {table.reservation.time})
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {table.status === "livre" && (
                    <button className="w-full bg-transparent border border-white text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                      <Plus className="h-4 w-4" />
                      Abrir Pedido
                    </button>
                  )}

                  {table.status === "ocupada" && (
                    <>
                      <button 
                        onClick={() => {
                          setSelectedTable(table.id);
                          setIsDrawerOpen(true);
                        }}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Ver Pedido
                      </button>
                      <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Finalizar
                      </button>
                    </>
                  )}

                  {table.status === "reservada" && (
                    <>
                      <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Confirmar
                      </button>
                      <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Order Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white dark:bg-neutral-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedTable && orderDetails[selectedTable] && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Mesa {selectedTable}
                </h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {orderDetails[selectedTable].client}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                Comanda: {orderDetails[selectedTable].commandId}
              </p>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Itens do Pedido
              </h3>
              {orderDetails[selectedTable].items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center text-3xl shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-neutral-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg px-3 py-1">
                      <button className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-semibold text-neutral-900 dark:text-white min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Subtotal
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    R$ {orderDetails[selectedTable].subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Taxa (10%)
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    R$ {orderDetails[selectedTable].tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-900 dark:text-white">Total</span>
                  <span className="text-orange-500">
                    R$ {orderDetails[selectedTable].total.toFixed(2)}
                  </span>
                </div>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors">
                Finalizar Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}