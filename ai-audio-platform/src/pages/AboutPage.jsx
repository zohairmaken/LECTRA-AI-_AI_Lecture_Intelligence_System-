import React from 'react';
import { motion } from 'motion/react';
import { FiLinkedin, FiGithub, FiMail, FiCpu, FiAward, FiGlobe, FiCode, FiActivity, FiMessageSquare } from 'react-icons/fi';

const AboutPage = () => {
    const expertise = [
        { name: 'Natural Language Processing', level: '95%', icon: FiMessageSquare },
        { name: 'Audio Signal Processing', level: '90%', icon: FiActivity },
        { name: 'Large Language Models', level: '92%', icon: FiCpu },
        { name: 'System Architecture', level: '88%', icon: FiGlobe },
        { name: 'Neural Networks', level: '94%', icon: FiAward },
        { name: 'Full-Stack Engineering', level: '85%', icon: FiCode },
    ];

    return (
        <div style={{ padding: '8rem 2rem 12rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* 1. HERO SECTION */}
            <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{ 
                        width: '240px', 
                        height: '240px', 
                        margin: '0 auto 3rem',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--error-color))',
                        borderRadius: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}>
                    <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: 'var(--background-color)', 
                        borderRadius: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        <FiCpu size={100} color="var(--accent-primary)" style={{ opacity: 0.8 }} />
                    </div>
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '950', marginBottom: '1rem', letterSpacing: '-2px' }}
                >
                    ZOHAIR HASSNAIN <span style={{ color: 'var(--accent-primary)' }}>MAKEN</span>
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: 'var(--accent-primary)', letterSpacing: '6px', fontWeight: '900', fontSize: '0.9rem', textTransform: 'uppercase' }}
                >
                    ML ENGINEER | AI ARCHITECT | FAST NUCES ALUMNI
                </motion.p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '5rem', alignItems: 'start' }}>
                {/* 2. VISION SECTION */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    style={{ background: 'var(--surface-card)', padding: '4rem', borderRadius: '32px', border: '1px solid var(--surface-border)' }}
                >
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <FiGlobe color="var(--accent-primary)" /> THE VISION
                    </h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '2', opacity: 0.8, marginBottom: '2rem' }}>
                        My mission is to democratize high-fidelity academic knowledge. Lectra-AI was born from a simple observation: **lectures are messy, but learning shouldn't be.**
                    </p>
                    <p style={{ fontSize: '1.1rem', lineHeight: '2', opacity: 0.8, marginBottom: '3rem' }}>
                        By leveraging state-of-the-art Transformer models and Signal Processing pipelines, I aim to bridge the gap between spoken word and retained intelligence. Every line of code in this project is optimized for academic clarity and accessibility.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="#" style={{ color: 'var(--text-primary)', opacity: 0.5, transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity=1} onMouseLeave={e => e.target.style.opacity=0.5}><FiLinkedin size={24} /></a>
                        <a href="#" style={{ color: 'var(--text-primary)', opacity: 0.5, transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity=1} onMouseLeave={e => e.target.style.opacity=0.5}><FiGithub size={24} /></a>
                        <a href="#" style={{ color: 'var(--text-primary)', opacity: 0.5, transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity=1} onMouseLeave={e => e.target.style.opacity=0.5}><FiMail size={24} /></a>
                    </div>
                </motion.div>

                {/* 3. EXPERTISE GRID */}
                <div>
                    <h2 style={{ fontSize: '0.75rem', letterSpacing: '4px', opacity: 0.4, fontWeight: '900', marginBottom: '3rem', textTransform: 'uppercase' }}>TECHNICAL_CAPABILITIES</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {expertise.map((item, i) => (
                            <motion.div 
                                key={item.name}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--surface-border)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <item.icon color="var(--accent-primary)" />
                                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.4, fontWeight: '900' }}>{item.level}</span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: item.level }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        viewport={{ once: true }}
                                        style={{ height: '100%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
