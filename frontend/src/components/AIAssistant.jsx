import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AIAssistant = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '¡Hola! 🎮 Soy tu asistente de GameVault. Puedo ayudarte a buscar y recomendar videojuegos de nuestro catálogo. ¿En qué puedo ayudarte hoy?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Only show if logged in
    if (!user) return null;

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMsg = { role: 'user', content: trimmed };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const history = updatedMessages
                .slice(1) // skip the initial greeting
                .slice(-10) // last 10 messages
                .map(m => ({ role: m.role, content: m.content }));

            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: trimmed, history })
            });

            if (!res.ok) {
                throw new Error('API error');
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: '❌ Lo siento, no pude conectarme. Comprueba que el servicio de IA está activo.'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                role: 'assistant',
                content: '¡Hola! 🎮 Soy tu asistente de GameVault. Puedo ayudarte a buscar y recomendar videojuegos de nuestro catálogo. ¿En qué puedo ayudarte hoy?'
            }
        ]);
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                id="ai-assistant-fab"
                className={`ai-fab ${isOpen ? 'ai-fab--open' : ''}`}
                onClick={() => setIsOpen(o => !o)}
                title="Asistente de IA"
                aria-label="Abrir asistente de videojuegos"
            >
                <span className="ai-fab__icon">{isOpen ? '✕' : '🤖'}</span>
                {!isOpen && <span className="ai-fab__pulse" />}
            </button>

            {/* Chat Panel */}
            <div className={`ai-chat-panel ${isOpen ? 'ai-chat-panel--open' : ''}`} role="dialog" aria-label="Asistente de IA">
                {/* Header */}
                <div className="ai-chat-header">
                    <div className="ai-chat-header__info">
                        <span className="ai-chat-header__avatar">🤖</span>
                        <div>
                            <p className="ai-chat-header__title">GameVault AI</p>
                            <p className="ai-chat-header__subtitle">Asistente de videojuegos</p>
                        </div>
                    </div>
                    <div className="ai-chat-header__actions">
                        <button
                            className="ai-chat-header__btn"
                            onClick={clearChat}
                            title="Limpiar conversación"
                            aria-label="Limpiar conversación"
                        >
                            🗑️
                        </button>
                        <button
                            className="ai-chat-header__btn"
                            onClick={() => setIsOpen(false)}
                            title="Cerrar"
                            aria-label="Cerrar asistente"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="ai-chat-messages" id="ai-chat-messages">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`ai-bubble ${msg.role === 'user' ? 'ai-bubble--user' : 'ai-bubble--bot'}`}
                        >
                            {msg.role === 'assistant' && (
                                <span className="ai-bubble__avatar">🤖</span>
                            )}
                            <div className="ai-bubble__content">
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="ai-bubble ai-bubble--bot">
                            <span className="ai-bubble__avatar">🤖</span>
                            <div className="ai-bubble__content ai-bubble__content--typing">
                                <span className="ai-typing-dot" />
                                <span className="ai-typing-dot" />
                                <span className="ai-typing-dot" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="ai-chat-input-area">
                    <textarea
                        ref={inputRef}
                        id="ai-chat-input"
                        className="ai-chat-input"
                        placeholder="Escribe tu pregunta sobre videojuegos..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={isLoading}
                        aria-label="Mensaje para el asistente"
                    />
                    <button
                        id="ai-chat-send"
                        className={`ai-chat-send-btn ${isLoading ? 'ai-chat-send-btn--disabled' : ''}`}
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        aria-label="Enviar mensaje"
                    >
                        ➤
                    </button>
                </div>
                <p className="ai-chat-footer">Solo responde sobre el catálogo de GameVault</p>
            </div>

            {/* Backdrop (mobile) */}
            {isOpen && <div className="ai-backdrop" onClick={() => setIsOpen(false)} />}
        </>
    );
};

export default AIAssistant;
