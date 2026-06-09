import React from 'react';

const EvaluationView = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>PERFORMANCE METRICS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3>Overall Mastery</h3>
                    <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--success-color)', margin: '1rem 0' }}>87%</div>
                    <p style={{ color: 'var(--text-muted)' }}>Top 10% of cohort</p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3>Weak Concepts detected</h3>
                    <div style={{ marginTop: '1rem' }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            background: 'rgba(255, 42, 109, 0.2)',
                            color: 'var(--error-color)',
                            border: '1px solid var(--error-color)',
                            borderRadius: '20px',
                            marginRight: '0.5rem'
                        }}>Wave Particle Duality</span>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            background: 'rgba(255, 42, 109, 0.2)',
                            color: 'var(--error-color)',
                            border: '1px solid var(--error-color)',
                            borderRadius: '20px'
                        }}>Fourier Transform</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluationView;
