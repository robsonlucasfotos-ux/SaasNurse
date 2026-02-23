'use client';
import { useState } from 'react';
import { ciap2Database, CIAP2Code } from '@/data/ciap2';
import styles from './Ciap2Select.module.css';
import { Search } from 'lucide-react';

interface Props {
    onSelect: (code: CIAP2Code) => void;
    selectedCode?: CIAP2Code | null;
}

export default function Ciap2Select({ onSelect, selectedCode }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredCodes = ciap2Database.filter(
        c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <label className="form-label">Código CIAP-2 da Condição/Diagnóstico</label>
            <div
                className={styles.selector}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedCode ? (
                    <div>
                        <strong>{selectedCode.code}</strong> - {selectedCode.name}
                    </div>
                ) : (
                    <span className="text-muted">Selecione um código CIAP-2...</span>
                )}
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.searchBox}>
                        <Search size={16} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Buscar por código ou nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <ul className={styles.list}>
                        {filteredCodes.map(c => (
                            <li
                                key={c.code}
                                className={styles.listItem}
                                onClick={() => {
                                    onSelect(c);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                            >
                                <div className={styles.itemCode}>{c.code}</div>
                                <div className={styles.itemInfo}>
                                    <div className={styles.itemName}>{c.name}</div>
                                    <div className={styles.itemCat}>{c.category}</div>
                                </div>
                            </li>
                        ))}
                        {filteredCodes.length === 0 && (
                            <li className={styles.noResults}>Nenhum código encontrado.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
