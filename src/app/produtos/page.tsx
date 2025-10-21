"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function ProdutosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = [
    "Todos",
    "Sanduíches",
    "Acompanhamentos",
    "Bebidas",
    "Pizzas",
  ];

  const products = [
    {
      id: "P001",
      image: "🍔",
      name: "Hambúrguer Clássico",
      category: "Sanduíches",
      price: "R$ 25.99",
      stock: 150,
    },
    {
      id: "P002",
      image: "🍟",
      name: "Batata Frita Grande",
      category: "Acompanhamentos",
      price: "R$ 12.50",
      stock: 200,
    },
    {
      id: "P003",
      image: "🧃",
      name: "Suco de Laranja Natural",
      category: "Bebidas",
      price: "R$ 8.00",
      stock: 80,
    },
    {
      id: "P004",
      image: "🥤",
      name: "Milkshake de Chocolate",
      category: "Bebidas",
      price: "R$ 18.00",
      stock: 40,
    },
    {
      id: "P005",
      image: "🍕",
      name: "Pizza Calabresa Média",
      category: "Pizzas",
      price: "R$ 45.00",
      stock: 10,
    },
    {
      id: "P006",
      image: "🧅",
      name: "Anéis de Cebola",
      category: "Acompanhamentos",
      price: "R$ 10.00",
      stock: 75,
    },
    {
      id: "P007",
      image: "☕",
      name: "Café Expresso",
      category: "Bebidas",
      price: "R$ 6.50",
      stock: 120,
    },
  ];

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Controle de Produtos e Estoque
        </h1>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors">
          <Plus className="h-5 w-5" />
          Adicionar Produto
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-neutral-600 dark:text-neutral-400">
          Filtrar por Categoria:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
        <div className="p-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
            Lista de Produtos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Imagem
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Nome do Produto
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Esto
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-neutral-200 dark:border-neutral-700/50 last:border-0 hover:bg-neutral-200 dark:hover:bg-neutral-700/30 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm text-neutral-900 dark:text-white font-medium">
                      {product.id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-12 h-12 bg-neutral-300 dark:bg-neutral-700 rounded-lg flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-900 dark:text-white font-medium">
                      {product.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600 dark:text-neutral-300">
                      {product.category}
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-900 dark:text-white font-medium">
                      {product.price}
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-900 dark:text-white">
                      {product.stock}
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
