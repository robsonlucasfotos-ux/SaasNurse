'use client';

import { useState } from 'react';
import {
    Package,
    AlertCircle,
    CheckCircle2,
    Plus,
    Minus,
    Filter,
    ShoppingCart,
    MapPin
} from 'lucide-react';

interface StockItem {
    id: string;
    name: string;
    quantity: number;
    minQuantity: number;
    sector: 'Sala de Vacina' | 'Refeitório' | 'Salas Clínicas' | 'Limpeza' | 'Escritório';
    unit: string;
}

const initialStock: StockItem[] = [
    { id: '1', name: 'Luvas de Procedimento (M)', quantity: 45, minQuantity: 50, sector: 'Salas Clínicas', unit: 'Caixas' },
    { id: '2', name: 'Seringas 5ml', quantity: 120, minQuantity: 100, sector: 'Sala de Vacina', unit: 'Unid' },
    { id: '3', name: 'Agulhas 25x7', quantity: 80, minQuantity: 200, sector: 'Sala de Vacina', unit: 'Unid' },
    { id: '4', name: 'Álcool 70% (1L)', quantity: 5, minQuantity: 10, sector: 'Salas Clínicas', unit: 'Frascos' },
    { id: '5', name: 'Máscaras Descartáveis', quantity: 300, minQuantity: 100, sector: 'Salas Clínicas', unit: 'Unid' },
    { id: '6', name: 'Café (500g)', quantity: 12, minQuantity: 5, sector: 'Refeitório', unit: 'Pacotes' },
    { id: '7', name: 'Copo Descartável', quantity: 2, minQuantity: 10, sector: 'Refeitório', unit: 'Pacotes' },
    { id: '8', name: 'Alvejante (5L)', quantity: 2, minQuantity: 4, sector: 'Limpeza', unit: 'Frascos' },
    { id: '9', name: 'Saco de Lixo Infectante', quantity: 15, minQuantity: 20, sector: 'Limpeza', unit: 'Rolos' },
    { id: '10', name: 'Papel A4', quantity: 8, minQuantity: 10, sector: 'Escritório', unit: 'Resmas' },
    { id: '11', name: 'Caneta Azul', quantity: 3, minQuantity: 12, sector: 'Escritório', unit: 'Unid' },
];

export default function UnitManagementPage() {
    const [stock, setStock] = useState<StockItem[]>(initialStock);
    const [filterSector, setFilterSector] = useState<string>('Todos');

    const updateQuantity = (id: string, delta: number) => {
        setStock(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        ));
    };

    const filteredStock = filterSector === 'Todos'
        ? stock
        : stock.filter(item => item.sector === filterSector);

    const lowStockItems = stock.filter(item => item.quantity <= item.minQuantity);

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2>Gestão da Unidade</h2>
                    <p className="text-muted">Controle de insumos, materiais e estoque por setor.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button className="btn btn-outline flex items-center gap-2">
                        <ShoppingCart size={18} /> Pedido de Material
                        {lowStockItems.length > 0 && (
                            <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-[10px]">
                                {lowStockItems.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alertas Críticos */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="card border-l-4 border-red-500 bg-red-50/30">
                        <h3 className="flex items-center gap-2 text-red-600 mb-4">
                            <AlertCircle size={20} /> Atenção: Reposição Necessária
                        </h3>
                        <div className="flex flex-col gap-2">
                            {lowStockItems.length === 0 ? (
                                <p className="text-sm text-muted">Todos os itens em nível seguro.</p>
                            ) : (
                                lowStockItems.map(item => (
                                    <div key={item.id} className="text-sm flex justify-between p-2 bg-white rounded border border-red-100 shadow-sm">
                                        <span>{item.name}</span>
                                        <span className="font-bold text-red-600">{item.quantity} {item.unit}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="flex items-center gap-2 mb-4">
                            <Filter size={18} /> Filtrar por Setor
                        </h3>
                        <div className="flex flex-col gap-2">
                            {['Todos', 'Sala de Vacina', 'Refeitório', 'Salas Clínicas', 'Limpeza', 'Escritório'].map(sector => (
                                <button
                                    key={sector}
                                    onClick={() => setFilterSector(sector)}
                                    className={`p-3 rounded text-left transition-all border ${filterSector === sector ? 'bg-primary text-white border-primary' : 'hover:bg-surface border-transparent'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} /> {sector}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lista de Estoque */}
                <div className="lg:col-span-2">
                    <div className="card h-full">
                        <div className="mb-4 flex justify-between items-center">
                            <h3>Inventário de Insumos</h3>
                            <span className="text-xs text-muted">{filteredStock.length} itens listados</span>
                        </div>

                        <div className="overflow-x-auto border rounded">
                            <table className="w-full text-left text-sm min-w-[500px]">
                                <thead className="bg-surface text-muted">
                                    <tr>
                                        <th className="p-3">Insumo</th>
                                        <th className="p-3">Setor</th>
                                        <th className="p-3 text-center">Quantidade</th>
                                        <th className="p-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredStock.map(item => {
                                        const isLow = item.quantity <= item.minQuantity;
                                        return (
                                            <tr key={item.id} className="hover:bg-surface-hover">
                                                <td className="p-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">{item.name}</span>
                                                        <span className="text-[10px] text-muted">Mínimo: {item.minQuantity} {item.unit}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <span className="text-[10px] px-2 py-1 bg-muted rounded-full uppercase font-bold">
                                                        {item.sector}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <div className={`inline-flex items-center gap-2 font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                                                        {isLow && <AlertCircle size={14} />}
                                                        {item.quantity} {item.unit}
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="p-1 hover:bg-surface-hover rounded text-red-500"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="p-1 hover:bg-surface-hover rounded text-green-500"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 bg-muted rounded-lg flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded">
                    <CheckCircle2 className="text-primary" size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-bold">Dica de Gestão</h4>
                    <p className="text-xs text-muted">Mantenha o estoque atualizado diariamente para que o sistema possa prever o tempo médio de consumo e automatizar o pedido de materiais junto ao almoxarifado central.</p>
                </div>
            </div>
        </div>
    );
}
