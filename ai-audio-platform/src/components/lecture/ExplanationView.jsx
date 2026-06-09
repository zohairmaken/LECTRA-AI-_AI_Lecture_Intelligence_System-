import React from 'react';

const ExplanationView = () => {
    return (
        <div style={{ padding: '2rem', textAlign: 'left' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>AI EXPLANATION ENGINE</h2>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <p>Select Difficulty Level:</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="glass-panel" style={{ padding: '0.5rem 1rem', borderColor: 'var(--success-color)' }}>BEGINNER</button>
                    <button className="glass-panel" style={{ padding: '0.5rem 1rem', borderColor: 'var(--accent-color)' }}>INTERMEDIATE</button>
                    <button className="glass-panel" style={{ padding: '0.5rem 1rem', borderColor: 'var(--error-color)' }}>ADVANCED</button>
                </div>
            </div>
            <div className="glass-panel" style={{ padding: '2rem', minHeight: '300px' }}>
                <p style={{ color: 'var(--text-muted)' }}>// WAITING FOR SELECTION...</p>
            </div>
        </div>
    );
};

export default ExplanationView;
