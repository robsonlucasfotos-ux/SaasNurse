'use client';

import { useState, useEffect } from 'react';
import { Settings, Building, MapPin, Phone, Save, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ConfigPage() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState({
        bussinessName: '',
        address: '',
        phone: ''
    });

    useEffect(() => {
        const loadConfig = () => {
            const savedName = localStorage.getItem('clinica_name') || '';
            const savedAddress = localStorage.getItem('clinica_address') || '';
            const savedPhone = localStorage.getItem('clinica_phone') || '';
            setConfig({
                bussinessName: savedName,
                address: savedAddress,
                phone: savedPhone
            });
        };
        loadConfig();
    }, []);

    const handleSave = () => {
        setIsLoading(true);
        // Usaremos o localStorage para manter as configurações de White-Label na máquina atual. 
        // Em um escopo B2B avançado, vincularíamos a uma tabela 'clinic_settings'.
        localStorage.setItem('clinica_name', config.bussinessName);
        localStorage.setItem('clinica_address', config.address);
        localStorage.setItem('clinica_phone', config.phone);

        setTimeout(() => {
            setIsLoading(false);
            alert('Configurações salvas! Elas aparecerão nos cabeçalhos e formulários impressos (Prontuários).');
            // Força um recarregamento da tela se necessário atualizar o Header na mesma aba
            window.dispatchEvent(new Event('storage'));
        }, 800);
    };

    return (
        <div className="flex flex-col h-full gap-8 pb-20 max-w-lg mx-auto w-full animate-in fade-in">
            <div className="flex items-center gap-4 border-b pb-4">
                <Link href="/" className="btn btn-ghost p-2 -ml-2 text-muted hover:text-black">
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><Settings size={22} /> Configurações SaaS</h2>
                    <p className="text-muted text-sm mt-1">Personalize a identidade da sua Unidade (White-label)</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col gap-5">

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Building size={16} className="text-primary" /> Nome da Instituição / UBS
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex: ESF Novo Gama - Equipe 1"
                            value={config.bussinessName}
                            onChange={(e) => setConfig({ ...config, bussinessName: e.target.value })}
                        />
                        <span className="text-xs text-muted">Este nome aparecerá nos Prontuários Médicos.</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <MapPin size={16} className="text-primary" /> Endereço Completo
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex: Rua XYZ, Centro, Cidade-UF"
                            value={config.address}
                            onChange={(e) => setConfig({ ...config, address: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Phone size={16} className="text-primary" /> Telefone ou WhatsApp Oficial
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex: (61) 99999-9999"
                            value={config.phone}
                            onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={handleSave}
                        className="btn btn-primary w-full flex justify-center items-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isLoading ? 'Salvando...' : 'Salvar Personalização'}
                    </button>
                </div>
            </div>
        </div>
    );
}
