import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getTranscripts } from '../services/transcriptService';
import { 
    FiUploadCloud, FiBook, FiActivity, FiClock, 
    FiChevronRight, FiCpu, FiTrendingUp, FiZap, FiGrid, FiShield, FiFileText 
} from 'react-icons/fi';

const Dashboard = () => {
    const navigate = useNavigate();
    const [transcripts, setTranscripts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTranscripts = async () => {
            try {
                const data = await getTranscripts();
                setTranscripts(data || []);
            } catch (err) {
                console.error("Dashboard: Failed to load logs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTranscripts();
    }, []);

    const stats = [
        { label: 'Total Lectures', value: transcripts.length, icon: FiBook, color: 'var(--accent-primary)' },
        { label: 'Completed', value: transcripts.filter(t => t.status === 'Completed').length, icon: FiActivity, color: 'var(--success-color)' },
        { label: 'Platform Stability', value: '100%', icon: FiShield, color: 'var(--accent-primary)' }
    ];

    const quickActions = [
        { title: 'Upload New', desc: 'Process new audio content', icon: FiUploadCloud, path: '/upload', color: 'var(--accent-primary)' },
        { title: 'Lecture Vault', desc: 'Browse processed sessions', icon: FiGrid, path: '/library', color: 'var(--accent-primary)' },
        { title: 'Study Tools', desc: 'Summaries and quizzes', icon: FiCpu, path: '/learning-hub', color: 'var(--accent-primary)' }
    ];

    if (loading) return (
        <div style={{ padding: '10rem', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--surface-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }} />
            <p style={{ letterSpacing: '1px', fontSize: '0.9rem', opacity: 0.5, fontWeight: '600' }}>Synchronizing Dashboard...</p>
        </div>
    );

    return (
        <div style={{ padding: '2rem 3rem 8rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {/* 1. HERO HEADER */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--surface-border)', paddingBottom: '2.5rem' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.5, fontWeight: '700', marginBottom: '0.75rem' }}>SYSTEM_STATUS: ACTIVE</div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>Platform <span style={{ color: 'var(--accent-primary)' }}>Overview</span></h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(79, 70, 229, 0.05)', padding: '0.6rem 1.25rem', borderRadius: '100px', border: '1px solid rgba(79, 70, 229, 0.2)', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700' }}
                    >
                        <FiTrendingUp /> Systems Syncronized
                    </motion.div>
                </div>
            </header>

            {/* 2. STATS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            padding: '2.5rem', background: 'var(--surface-card)', borderRadius: '24px', border: '1px solid var(--surface-border)',
                            display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <div style={{ color: s.color, opacity: 0.6 }}><s.icon size={22} /></div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{s.value}</div>
                        <div style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.5, fontWeight: '700' }}>{s.label}</div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: s.color, opacity: 0.2 }} />
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem', alignItems: 'start' }}>
                {/* 3. MAIN ACTIVITY FEED */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '0.85rem', letterSpacing: '1px', opacity: 0.5, fontWeight: '700' }}>Recent Activity</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/library')}>View All Records</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <AnimatePresence>
                            {transcripts.slice(0, 6).map((t, i) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => navigate(`/transcript/${t.id}`)}
                                    style={{
                                        padding: '1.75rem 2.5rem', background: 'var(--surface-card)', borderRadius: '20px', border: '1px solid var(--surface-border)',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateX(8px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'var(--background-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                                            <FiFileText color={t.status === 'Completed' ? 'var(--success-color)' : 'var(--accent-primary)'} size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{t.title || 'UNTITLED_LECTURE'}</div>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.3, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                PROCESSED: {new Date(t.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                                         <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: t.status === 'Completed' ? 'var(--success-color)' : 'var(--warning-color)' }}>{t.status}</div>
                                            <div style={{ fontSize: '0.65rem', opacity: 0.4, fontWeight: '600' }}>Status</div>
                                         </div>
                                         <FiChevronRight style={{ opacity: 0.4 }} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {transcripts.length === 0 && (
                            <div style={{ padding: '8rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '32px', border: '2px dashed var(--surface-border)' }}>
                                <p style={{ letterSpacing: '4px', opacity: 0.3, fontSize: '0.9rem', fontWeight: '900' }}>NO_LECTURES_FOUND</p>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/upload')}
                                    style={{ marginTop: '2.5rem', padding: '1rem 3rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Upload New Lecture
                                </motion.button>
                            </div>
                        )}
                    </div>
                </section>

                {/* 4. QUICK ACTIONS SIDEBAR */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ fontSize: '0.85rem', letterSpacing: '1px', opacity: 0.5, fontWeight: '700', marginBottom: '0.5rem' }}>Quick Actions</div>
                    {quickActions.map((action, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5, borderColor: action.color }}
                            onClick={() => navigate(action.path)}
                            style={{
                                padding: '2.5rem', background: 'var(--surface-card)', borderRadius: '24px', border: '1px solid var(--surface-border)',
                                cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.03, color: action.color }}><action.icon size={100} /></div>
                            <div style={{ width: '45px', height: '45px', background: 'rgba(79, 70, 229, 0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color, marginBottom: '2rem', border: '1px solid rgba(79, 70, 229, 0.15)' }}>
                                <action.icon size={22} />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{action.title}</h3>
                            <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.6' }}>{action.desc}</p>
                        </motion.div>
                    ))}

                    <div style={{ padding: '2.5rem', background: 'var(--surface-card)', borderRadius: '24px', border: '1px solid var(--accent-primary)', position: 'relative', overflow: 'hidden' }}>
                        <FiShield size={32} style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Data Security</h3>
                        <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.6' }}>
                            All lecture metadata is secured using AES-256 encryption. Your academic privacy is our priority.
                        </p>
                    </div>
                </aside>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Dashboard;
