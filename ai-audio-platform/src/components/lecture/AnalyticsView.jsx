import React from 'react';

const AnalyticsView = () => {
    return (
        <div style={{ padding: '1rem' }}>
            <h2 style={{ marginBottom: '2rem', color: 'cyan' }}>LECTURE ANALYTICS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', height: '300px' }}>
                    <h3>Engagement Graph</h3>
                    <div style={{
                        width: '100%',
                        height: '200px',
                        background: 'linear-gradient(to right, transparent, rgba(0, 243, 255, 0.2), transparent)',
                        marginTop: '1rem',
                        display: 'flex',
                        alignItems: 'flex-end'
                    }}>
                        {/* Fake graph bars */}
                        {[30, 50, 40, 70, 80, 60, 40, 20, 50, 40].map((h, i) => (
                            <div key={i} style={{
                                width: '10%',
                                height: `${h}%`,
                                background: 'var(--primary-color)',
                                margin: '0 2px',
                                opacity: 0.7
                            }}></div>
                        ))}
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '2rem', height: '300px' }}>
                    <h3>Topic Breakdown</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                        <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Introduction to Thermodynamics (15%)</li>
                        <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Heat Engines (35%)</li>
                        <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Entropy (30%)</li>
                        <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Q&A Session (20%)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
