import React from 'react';

const RAGChat = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>LECTURE CHAT</h2>

            <div className="glass-panel" style={{ flex: 1, marginBottom: '1rem', padding: '1rem', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>AI:</span>
                    <p>I have analyzed the lecture. Ask me anything about specific concepts or timestamps.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" placeholder="Ask about this lecture..." style={{ flex: 1 }} />
                <button style={{
                    padding: '0.8rem 2rem',
                    background: 'var(--primary-color)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>SEND</button>
            </div>
        </div>
    );
};

export default RAGChat;
