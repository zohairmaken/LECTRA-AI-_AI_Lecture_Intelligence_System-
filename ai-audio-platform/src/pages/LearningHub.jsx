import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { getQuizHistory } from '../services/quizService';
import { 
    FiBookOpen, FiClock, FiCheckCircle, FiXCircle, 
    FiArrowLeft, FiAward, FiTrendingUp, FiActivity, FiTarget 
} from 'react-icons/fi';

const LearningHub = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResult, setSelectedResult] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getQuizHistory();
                setHistory(data || []);
            } catch (err) {
                console.error("Failed to fetch learning hub history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const averageScore = history.length > 0 
        ? Math.round(history.reduce((acc, curr) => acc + (curr.score || 0), 0) / history.length) 
        : 0;

    const renderDetails = (result) => {
        const scoreColor = result.score >= 80 ? 'var(--success-color)' : result.score >= 50 ? '#ffe600' : '#ff2a6d';

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '1px solid var(--surface-border)', paddingBottom: '2rem', marginBottom: '3rem'
                }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', letterSpacing: '3px', opacity: 0.4, fontWeight: '900', marginBottom: '0.5rem' }}>ASSESSMENT_REPORT</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '950', letterSpacing: '-1px' }}>{result.lecture_title || 'UNTITLED_ASSESSMENT'}</h2>
                    </div>
                    <button onClick={() => setSelectedResult(null)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem 1.5rem', background: 'var(--surface-panel)',
                        border: '1px solid var(--surface-border)', borderRadius: '12px',
                        color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800'
                    }}>
                        <FiArrowLeft size={14} /> BACK_TO_LIST
                    </button>
                </div>

                {/* Score Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {[
                        { label: 'RETENTION_SCORE', value: `${result.score}%`, color: scoreColor, icon: FiAward },
                        { label: 'ACCURACY', value: `${result.details?.filter(d => d.isCorrect).length || 0}/${result.details?.length || 0}`, color: 'var(--accent-primary)', icon: FiTarget },
                        { label: 'TIMESTAMP', value: new Date(result.completed_at).toLocaleDateString(), color: 'var(--text-muted)', icon: FiClock }
                    ].map((card, i) => (
                        <div key={i} style={{ 
                            background: 'var(--surface-card)', padding: '2.5rem', borderRadius: '24px', 
                            border: '1px solid var(--surface-border)', position: 'relative'
                        }}>
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1 }}><card.icon size={40} /></div>
                            <p style={{ margin: 0, opacity: 0.4, fontSize: '0.65rem', fontWeight: '900', letterSpacing: '2px' }}>{card.label}</p>
                            <p style={{ margin: '1rem 0 0', fontSize: '2.5rem', fontWeight: '950', color: card.color }}>{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Details List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {result.details && result.details.map((detail, idx) => (
                        <div key={idx} style={{
                            padding: '2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--surface-border)',
                            borderLeft: `4px solid ${detail.isCorrect ? 'var(--success-color)' : 'var(--error-color)'}`
                        }}>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ marginTop: '0.2rem' }}>
                                    {detail.isCorrect ? <FiCheckCircle color="var(--success-color)" size={20} /> : <FiXCircle color="var(--error-color)" size={20} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: '700' }}>Q{idx+1}: {detail.questionText}</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.8, fontSize: '0.9rem' }}>
                                        <p style={{ margin: 0 }}>Response: <span style={{ color: detail.isCorrect ? 'var(--success-color)' : 'var(--error-color)', fontWeight: '700' }}>{detail.userAnswer || 'NULL'}</span></p>
                                        {!detail.isCorrect && <p style={{ margin: 0 }}>Reference: <span style={{ fontWeight: '700' }}>{detail.correctAnswer}</span></p>}
                                        {detail.feedback && <p style={{ margin: '0.5rem 0 0', padding: '1rem', background: 'var(--background-color)', borderRadius: '12px', fontStyle: 'italic', opacity: 0.6 }}>{detail.feedback}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    };

    return (
        <div style={{ padding: '2rem 3rem 8rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {/* 1. OVERVIEW HERO */}
            {!selectedResult && (
                <div style={{ background: 'var(--surface-card)', padding: '4rem', borderRadius: '40px', border: '1px solid var(--surface-border)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.03 }}><FiActivity size={350} /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', letterSpacing: '6px', opacity: 0.4, fontWeight: '950', marginBottom: '1.5rem' }}>RETENTION_INDEX</p>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: '950', margin: 0, letterSpacing: '-2px' }}>LEARNING <span style={{ color: 'var(--accent-primary)' }}>HUB</span></h1>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '3rem', fontWeight: '950', color: 'var(--accent-primary)' }}>{averageScore}%</div>
                            <div style={{ fontSize: '0.65rem', letterSpacing: '2px', opacity: 0.4, fontWeight: '900' }}>AVG_MASTERY_RATE</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }}>
                        {[
                            { label: 'SESSIONS', value: history.length },
                            { label: 'TOP_DOMAIN', value: 'NLP_SYSTEMS' },
                            { label: 'STREAK', value: '4_SESSIONS' }
                        ].map((stat, i) => (
                            <div key={i} style={{ padding: '1rem 2rem', background: 'var(--background-color)', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                                <div style={{ fontSize: '0.6rem', letterSpacing: '2px', opacity: 0.3, fontWeight: '900', marginBottom: '0.5rem' }}>{stat.label}</div>
                                <div style={{ fontSize: '1rem', fontWeight: '900' }}>{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. CONTENT AREA */}
            <main>
                {loading ? (
                    <div style={{ padding: '10rem', textAlign: 'center' }}><Loader label="LOADING_ANALYTICS..." /></div>
                ) : selectedResult ? (
                    renderDetails(selectedResult)
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '0.75rem', letterSpacing: '4px', opacity: 0.4, fontWeight: '950' }}>HISTORICAL_RECORDS</h3>
                            <div style={{ color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px' }}><FiTrendingUp style={{ marginRight: '0.5rem' }} /> PERFORMANCE_STABLE</div>
                        </div>

                        <AnimatePresence>
                            {history.length > 0 ? (
                                history.map((result, i) => {
                                    const scoreColor = result.score >= 80 ? 'var(--success-color)' : result.score >= 50 ? '#ffe600' : '#ff2a6d';
                                    return (
                                        <motion.div
                                            key={result.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => setSelectedResult(result)}
                                            style={{
                                                padding: '2rem', background: 'var(--surface-card)', borderRadius: '24px',
                                                border: '1px solid var(--surface-border)', cursor: 'pointer',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateX(10px)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                <div style={{ 
                                                    width: '60px', height: '60px', borderRadius: '16px', 
                                                    background: 'var(--background-color)', display: 'flex', 
                                                    alignItems: 'center', justifyContent: 'center',
                                                    color: scoreColor, fontWeight: '900', border: `1px solid ${scoreColor}44`
                                                }}>{result.score}%</div>
                                                <div>
                                                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{result.lecture_title || 'UNTITLED_LOG'}</h4>
                                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.7rem', opacity: 0.4, fontWeight: '700' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FiClock /> {new Date(result.completed_at).toLocaleDateString()}</span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FiBookOpen /> {(result.details?.length || 0)} QUESTIONS</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <FiArrowLeft style={{ transform: 'rotate(180deg)', opacity: 0.2 }} />
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div style={{ textAlign: 'center', padding: '8rem', background: 'rgba(255,255,255,0.01)', borderRadius: '32px', border: '1px dashed var(--surface-border)' }}>
                                    <FiActivity size={48} style={{ opacity: 0.2, marginBottom: '2rem' }} />
                                    <p style={{ letterSpacing: '3px', opacity: 0.4, fontSize: '0.9rem' }}>NO_RECORDS_FOUND</p>
                                    <Button variant="primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '2.5rem' }}>LAUNCH_NEW_SESSION</Button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LearningHub;
