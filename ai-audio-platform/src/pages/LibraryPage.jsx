import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getTranscripts } from '../services/transcriptService';
import { 
    FiSearch, FiFilter, FiFileText, FiCalendar, 
    FiClock, FiChevronRight, FiGrid, FiList, FiTrash2 
} from 'react-icons/fi';

const LibraryPage = () => {
    const navigate = useNavigate();
    const [transcripts, setTranscripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        const fetchTranscripts = async () => {
            try {
                const data = await getTranscripts();
                setTranscripts(data || []);
            } catch (err) {
                console.error("Library: Sync failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTranscripts();
    }, []);

    const filtered = transcripts.filter(t => 
        (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.status || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem 3rem 10rem' }}>
            <header style={{ marginBottom: '5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', letterSpacing: '4px', opacity: 0.4, fontWeight: '950', marginBottom: '1.5rem' }}>SYSTEM_STATUS: ACTIVE</div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '950', letterSpacing: '-2px', margin: 0 }}>LECTURE <span style={{ color: 'var(--accent-primary)' }}>LIBRARY</span></h1>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                        <input 
                            type="text" 
                            placeholder="SEARCH_BY_TITLE_OR_STATUS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '1.25rem 1.5rem 1.25rem 4rem', background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '16px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', background: 'var(--surface-card)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                        <button 
                            onClick={() => setViewMode('grid')}
                            style={{ padding: '0.75rem', background: viewMode === 'grid' ? 'var(--background-color)' : 'transparent', border: 'none', borderRadius: '8px', color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            <FiGrid size={20} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            style={{ padding: '0.75rem', background: viewMode === 'list' ? 'var(--background-color)' : 'transparent', border: 'none', borderRadius: '8px', color: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            <FiList size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {loading ? (
                <div style={{ padding: '10rem', textAlign: 'center', opacity: 0.2 }}>SYNCHRONIZING_LIBRARY...</div>
            ) : (
                <div style={{ 
                    display: viewMode === 'grid' ? 'grid' : 'flex',
                    flexDirection: viewMode === 'list' ? 'column' : 'none',
                    gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : 'none',
                    gap: '2rem'
                }}>
                    <AnimatePresence>
                        {filtered.map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => navigate(`/transcript/${t.id}`)}
                                style={{
                                    padding: '2.5rem', background: 'var(--surface-card)', borderRadius: '24px', border: '1px solid var(--surface-border)',
                                    cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--surface-border)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div style={{ width: '50px', height: '50px', background: 'var(--background-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                                        <FiFileText color={t.status === 'Completed' ? 'var(--success-color)' : 'var(--accent-primary)'} size={24} />
                                    </div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '950', letterSpacing: '2px', color: t.status === 'Completed' ? 'var(--success-color)' : '#ffe600' }}>
                                        {t.status?.toUpperCase()}
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', minHeight: '3.5rem' }}>{t.title || 'UNTITLED_LECTURE'}</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.4, fontSize: '0.7rem', fontWeight: '700' }}>
                                        <FiCalendar /> {new Date(t.created_at).toLocaleDateString()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.4, fontSize: '0.7rem', fontWeight: '700' }}>
                                        <FiClock /> {t.duration ? `${Math.floor(t.duration/60)}m` : '0m'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div style={{ padding: '10rem', textAlign: 'center', background: 'var(--surface-card)', borderRadius: '32px', border: '2px dashed var(--surface-border)' }}>
                    <p style={{ letterSpacing: '4px', opacity: 0.3, fontSize: '0.9rem', fontWeight: '900' }}>NO_MATCHING_RECORDS_FOUND</p>
                </div>
            )}
        </div>
    );
};

export default LibraryPage;
