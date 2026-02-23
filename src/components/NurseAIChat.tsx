'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import styles from './NurseAIChat.module.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function NurseAIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'initial', role: 'assistant', content: 'Olá! Sou o Guia Aps AI, seu assistente clínico. Como posso ajudar com protocolos hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        const newMessages: Message[] = [
            ...messages,
            { id: Date.now().toString(), role: 'user', content: userMsg }
        ];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await res.json();

            setMessages(prev => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply || 'Erro de comunicação.' }
            ]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Desculpe, ocorreu um erro ao conectar com o servidor.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <button
                className={styles.fab}
                onClick={() => setIsOpen(true)}
                style={{ display: isOpen ? 'none' : 'flex' }}
            >
                <MessageSquare size={24} />
            </button>

            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <div className={styles.headerTitle}>
                            <Bot size={20} />
                            <span>Guia Aps AI - Consulta Rápida</span>
                        </div>
                        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.messageList}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.userWrapper : styles.aiWrapper}`}
                            >
                                <div className={styles.avatar}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.userBubble : styles.aiBubble}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className={`${styles.messageWrapper} ${styles.aiWrapper}`}>
                                <div className={styles.avatar}><Bot size={16} /></div>
                                <div className={`${styles.messageBubble} ${styles.aiBubble}`}>
                                    Digitando...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.inputArea}>
                        <textarea
                            className={styles.input}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Pergunte sobre um protocolo..."
                            rows={1}
                        />
                        <button
                            className={styles.sendBtn}
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
