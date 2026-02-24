'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    Plus,
    Trash2,
    Palette,
    Loader2,
    Package
} from 'lucide-react';

interface Note {
    id: string;
    title: string;
    content: string;
    color: string;
}

const COLORS = [
    '#ffffff', // Branco
    '#fecaca', // Vermelho claro (Urgente)
    '#fef08a', // Amarelo (Atenção)
    '#bbf7d0', // Verde (Ok)
    '#bfdbfe', // Azul (Informativo)
    '#e9d5ff'  // Roxo
];

export default function UnitManagementPage() {
    const supabase = createClient();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newColor, setNewColor] = useState(COLORS[0]);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return;

            const { data, error } = await supabase
                .from('inventory_notes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setNotes(data);
        } catch (error) {
            console.error('Erro ao buscar notas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveNote = async () => {
        if (!newTitle.trim() && !newContent.trim()) {
            setIsAdding(false);
            return;
        }

        setIsSaving(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error("Usuário não autenticado");

            const { error } = await supabase
                .from('inventory_notes')
                .insert([{
                    user_id: userData.user.id,
                    title: newTitle || 'Sem Título',
                    content: newContent,
                    color: newColor
                }]);

            if (error) throw error;

            // Limpa form
            setNewTitle('');
            setNewContent('');
            setNewColor(COLORS[0]);
            setIsAdding(false);
            fetchNotes();
        } catch (error) {
            console.error('Erro ao salvar nota:', error);
            alert('Falha ao salvar anotação.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm('Deseja excluir este Post-it?')) return;
        try {
            const { error } = await supabase.from('inventory_notes').delete().eq('id', id);
            if (error) throw error;
            setNotes(notes.filter(n => n.id !== id));
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="text-primary" />
                        Pedidos e Estoque
                    </h2>
                    <p className="text-muted text-sm mt-1">Quadro de anotações ágeis (Estilo Keep)</p>
                </div>
            </div>

            {/* Take a note input */}
            <div className="max-w-2xl mx-auto w-full">
                {!isAdding ? (
                    <div
                        onClick={() => setIsAdding(true)}
                        className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-text transition-shadow flex items-center text-muted"
                    >
                        Criar um novo pedido de material...
                    </div>
                ) : (
                    <div
                        className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3 animate-in fade-in"
                        style={{ backgroundColor: isDarkColor(newColor) ? newColor : undefined, background: !isDarkColor(newColor) ? newColor : undefined }} // simplificando a cor
                    >
                        <input
                            type="text"
                            placeholder="Título (ex: Pedido Farmácia)"
                            className="bg-transparent border-none text-lg font-bold focus:outline-none focus:ring-0 placeholder:text-black/40 text-black w-full"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            autoFocus
                        />
                        <textarea
                            placeholder="Descreva os itens (ex: 5 caixas de luvas M...)"
                            className="bg-transparent border-none focus:outline-none focus:ring-0 resize-none placeholder:text-black/50 text-black w-full min-h-[80px]"
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                        />

                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-2">
                                {COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setNewColor(c)}
                                        className={`w-6 h-6 rounded-full border-2 transition-transform ${newColor === c ? 'scale-125 border-gray-400' : 'border-black/10'}`}
                                        style={{ backgroundColor: c }}
                                        aria-label={`Cor ${c}`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="btn btn-ghost text-black hover:bg-black/5 text-sm py-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveNote}
                                    disabled={isSaving}
                                    className="btn bg-black text-white hover:bg-black/80 text-sm py-1 flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Salvar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Masonry Grid */}
            {isLoading ? (
                <div className="flex justify-center py-12 text-primary">
                    <Loader2 size={32} className="animate-spin" />
                </div>
            ) : notes.length === 0 ? (
                <div className="text-center py-12 text-muted">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Nenhuma anotação de estoque ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className="group relative rounded-xl p-4 shadow-sm border border-black/5 transition-all hover:shadow-md"
                            style={{ backgroundColor: note.color, color: '#000' }}
                        >
                            <h3 className="font-bold text-lg mb-2 pr-6">{note.title}</h3>
                            <p className="text-sm whitespace-pre-wrap opacity-80">{note.content}</p>

                            <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 hover:bg-black/10 rounded-full text-black/60 hover:text-red-600"
                                title="Excluir anotação"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Utility para ajuste de cores escuro/claro ignorado para o MVP, vamos forçar texto preto nos post-its (Google Keep behavior)
function isDarkColor(hex: string) {
    return false; // Todos os COLORS escolhidos acima são claros/pastéis, então o texto pode ser sempre preto.
}
