import React from 'react';

const Loader = ({ label = 'Loading...' }) => {
    return (
        <div style={{
            padding: '2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
        }}>
            <div style={{
                width: '36px',
                height: '36px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTop: '3px solid #fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <span style={{
                fontSize: '0.8rem',
                letterSpacing: '2px',
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-family-display)'
            }}>
                {label}
            </span>
        </div>
    );
};

export default Loader;
