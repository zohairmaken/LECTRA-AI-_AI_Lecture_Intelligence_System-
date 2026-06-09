import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FiAlertOctagon, FiTerminal, FiChevronLeft } from 'react-icons/fi';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', maxWidth: '600px' }}
            >
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '12rem', fontWeight: '950', letterSpacing: '-10px', margin: 0, lineHeight: 1, opacity: 0.1, color: 'var(--accent-primary)' }}>404</h1>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
                        <FiAlertOctagon size={80} color="var(--accent-primary)" style={{ opacity: 0.8 }} />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                    <FiTerminal />
                    <span style={{ fontSize: '0.8rem', letterSpacing: '4px', fontWeight: '900' }}>SIGNAL_INTERRUPT_STATE_404</span>
                </div>

                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-1px' }}>KNOWLEDGE_VOOID_DETECTED</h2>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '4rem', opacity: 0.6 }}>
                    The page you are searching for does not exist in our current directory. The requested resource is unavailable or has been moved.
                </p>

                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '1.25rem 3rem', background: 'var(--surface-card)', border: '1px solid var(--accent-primary)', borderRadius: '16px', color: 'var(--accent-primary)', fontWeight: '950', fontSize: '0.85rem', letterSpacing: '3px', cursor: 'pointer', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '1rem'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-card)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                >
                    <FiChevronLeft /> REESTABLISH_UPLINK
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;
