import React from 'react';
import { motion } from 'motion/react';
import { FiCheckCircle, FiActivity, FiTarget, FiTrendingUp } from 'react-icons/fi';

const EvaluationPage = () => {
    // Mock evaluation data
    const evaluation = {
        strengths: ["Core concept retention: 94%", "Accuracy: Optimal", "High-frequency keyword identification"],
        improvements: ["Detailed extraction", "Section 2: Connection stability", "Context mapping"]
    };

    return (
        <div style={{ padding: '4rem 3rem 10rem', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <div style={{ display: 'inline-flex', padding: '0.5rem 1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '30px', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '3px', marginBottom: '2rem' }}>
                    <FiActivity style={{ marginRight: '0.75rem' }} /> EVALUATION SUMMARY
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '950', letterSpacing: '-2px', margin: 0 }}>PERFORMANCE <span style={{ color: 'var(--accent-primary)' }}>REVIEW</span></h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.4, marginTop: '1rem', fontWeight: '500' }}>Overall performance metrics across active learning sessions.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                {/* Strengths */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ background: 'var(--surface-card)', padding: '4rem', borderRadius: '32px', border: '1px solid var(--surface-border)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', color: 'var(--success-color)' }}>
                        <FiCheckCircle size={24} />
                        <h3 style={{ fontSize: '0.8rem', letterSpacing: '4px', fontWeight: '950', margin: 0 }}>STRENGTHS</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {evaluation.strengths.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)', marginTop: '0.5rem', boxShadow: '0 0 10px var(--success-color)' }} />
                                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', opacity: 0.8 }}>{s}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Improvements */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ background: 'var(--surface-card)', padding: '4rem', borderRadius: '32px', border: '1px solid var(--surface-border)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', color: 'var(--accent-primary)' }}>
                        <FiTrendingUp size={24} />
                        <h3 style={{ fontSize: '0.8rem', letterSpacing: '4px', fontWeight: '950', margin: 0 }}>AREAS FOR IMPROVEMENT</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {evaluation.improvements.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', marginTop: '0.5rem', boxShadow: '0 0 10px var(--accent-primary)' }} />
                                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', opacity: 0.8 }}>{s}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div style={{ marginTop: '5rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1rem 2.5rem', background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    <FiTarget /> OVERALL MASTERY: 92.4
                </div>
            </div>
        </div>
    );
};

export default EvaluationPage;
