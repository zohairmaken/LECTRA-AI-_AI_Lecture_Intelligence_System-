import React from 'react';

const StudySchedule = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>PERSONALIZED STUDY PROTOCOL</h2>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>Generating optimal learning path based on recent performance...</p>

                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                        padding: '1rem',
                        borderLeft: '4px solid var(--success-color)',
                        background: 'rgba(5, 255, 161, 0.1)'
                    }}>
                        <h4>TODAY - Revision</h4>
                        <p>Review: "Quantum Mechanics Basics" (Weak Topic)</p>
                    </div>
                    <div style={{
                        padding: '1rem',
                        borderLeft: '4px solid var(--secondary-color)',
                        background: 'rgba(189, 0, 255, 0.1)'
                    }}>
                        <h4>TOMORROW - New Module</h4>
                        <p>Start: "Eletromagnetism II"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudySchedule;
