'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { ciap2Database, CIAP2Code } from '@/data/ciap2'; // existing mock db

export default function CiapSearchPage() {
    const [query, setQuery] = useState('');

    const results = query.trim().length > 1
        ? ciap2Database.filter((c: CIAP2Code) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.code.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2>Buscador CIAP-2 (Atenção Primária)</h2>
                <p className="text-muted">Busque códigos pelo sintoma, queixa ou diagnóstico do paciente.</p>
            </div>

            <div className="card w-full flex-1 flex flex-col">
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-3 text-muted" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ex: dor de cabeça, febre, tosse, hipertensão..."
                        className="form-control pl-10"
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {query.trim().length > 1 && results.length === 0 && (
                        <div className="text-center text-muted py-8">
                            Nenhum código encontrado para "{query}". Tente outro sinônimo.
                        </div>
                    )}

                    {results.length > 0 && (
                        <ul className="space-y-3">
                            {results.map((c: CIAP2Code) => (
                                <li key={c.code} className="p-4 border rounded hover:bg-opacity-50 transition-colors" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-bold text-primary mr-2">{c.code}</span>
                                            <span className="font-semibold">{c.name}</span>
                                        </div>
                                        <button
                                            className="btn btn-secondary py-1 px-3 text-sm h-auto"
                                            onClick={() => navigator.clipboard.writeText(c.code + ' - ' + c.name)}
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {query.trim().length <= 1 && (
                        <div className="text-center text-muted py-8 opacity-70">
                            Digite pelo menos 2 letras do sintoma para buscar na lista rápida.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
