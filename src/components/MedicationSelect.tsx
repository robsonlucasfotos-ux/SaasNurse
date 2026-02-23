'use client';
import { useState } from 'react';
import { rename2024, Medication } from '@/data/rename2024';
import styles from './Ciap2Select.module.css'; // Reusing the same CSS module for consistency
import { Search } from 'lucide-react';

interface Props {
    onSelect: (med: Medication) => void;
    selectedMed?: Medication | null;
}

export default function MedicationSelect({ onSelect, selectedMed }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredMeds = rename2024.filter(
        m =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.indication.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <label className="form-label">Medicamento (RENAME 2024)</label>
            <div
                className={styles.selector}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedMed ? (
                    <div>
                        <strong>{selectedMed.name}</strong> - {selectedMed.presentation}
                    </div>
                ) : (
                    <span className="text-muted">Buscar por nome ou indicação...</span>
                )}
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.searchBox}>
                        <Search size={16} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Buscar por nome ou indicação..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <ul className={styles.list}>
                        {filteredMeds.map(m => (
                            <li
                                key={m.id}
                                className={styles.listItem}
                                onClick={() => {
                                    onSelect(m);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                            >
                                <div className={styles.itemInfo}>
                                    <div className={styles.itemName}>{m.name}</div>
                                    <div className={styles.itemCat}>{m.presentation}</div>
                                    <div className={styles.itemCat} style={{ color: 'var(--secondary)' }}>{m.indication}</div>
                                </div>
                            </li>
                        ))}
                        {filteredMeds.length === 0 && (
                            <li className={styles.noResults}>Nenhum medicamento encontrado.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
