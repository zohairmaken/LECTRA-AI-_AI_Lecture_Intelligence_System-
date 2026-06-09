import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import TranscriptViewer from '../components/transcript/TranscriptViewer';
import AudioPlayer from '../components/audio/AudioPlayer';
import useTranscript from '../hooks/useTranscript';
import { 
    FiHeadphones, FiFileText, FiUsers, FiCpu, FiDownload, 
    FiCopy, FiCheck, FiArrowLeft, FiZap, FiInfo, FiLayers 
} from 'react-icons/fi';

const AUDIO_BASE = 'http://localhost:8000/sub/uploads';

const TranscriptPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { transcript, loading, error } = useTranscript(id);
    const [activeTab, setActiveTab] = useState('audio');
    const [audioVersion, setAudioVersion] = useState('processed');
    const [copied, setCopied] = useState(false);
    const [numMCQs, setNumMCQs] = useState(5);

    // Audio source builder
    const getAudioSrc = (version) => {
        if (!transcript) return '';
        const filename = (version === 'processed' && transcript.clean_file_path)
            ? (transcript.clean_file_path || '').split(/[\\/]/).pop()
            : (transcript.filename || '');
        return `${AUDIO_BASE}/${filename}`;
    };

    // Tabs definition
    const TABS = [
        { id: 'audio', label: 'Audio Analysis', icon: FiHeadphones },
        { id: 'transcript', label: 'Transcript', icon: FiFileText },
        { id: 'diarization', label: 'Speaker Highlights', icon: FiUsers },
        { id: 'quiz', label: 'Study Tools', icon: FiCpu },
    ];

    // Styles
    const tabButtonStyle = (isActive) => ({
        padding: '1rem 2rem',
        background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
        border: 'none',
        borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        transition: 'all 0.3s ease',
        flex: 1,
        justifyContent: 'center'
    });

    const actionButtonStyle = {
        padding: '0.75rem 1.25rem',
        background: 'var(--surface-panel)',
        border: '1px solid var(--surface-border)',
        borderRadius: '12px',
        color: 'var(--text-primary)',
        fontSize: '0.75rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    };

    if (loading && !transcript) return (
        <div style={{ padding: '10rem', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--surface-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }} />
            <p style={{ letterSpacing: '1px', fontSize: '0.9rem', opacity: 0.5, fontWeight: '600' }}>Synchronizing Data...</p>
        </div>
    );

    if (error) return (
        <div style={{ padding: '10rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--error-color)', marginBottom: '2rem', fontWeight: 'bold' }}>INTERFACE ERROR: {error.message}</div>
            <button onClick={() => navigate('/dashboard')} style={actionButtonStyle}>Return to Dashboard</button>
        </div>
    );

    return (
        <div style={{ padding: '2rem 3rem 8rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. HEADER SECTION */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <FiArrowLeft size={24} />
                    </button>
                    <div>
                        <div style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.5, fontWeight: '700', marginBottom: '0.5rem' }}>SESSION SUMMARY / {id}</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{transcript?.title || 'Untitled Lecture'}</h1>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: '700' }}>STATUS</div>
                        <div style={{ color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: '700' }}>{transcript?.status}</div>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'var(--surface-border)' }} />
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: '700' }}>DURATION</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{Math.floor((transcript?.duration || 0) / 60)}m {(transcript?.duration || 0) % 60}s</div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '3rem', alignItems: 'start' }}>
                {/* 2. SIDEBAR PANEL (AUDIO & INFO) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem' }}>
                    <div style={{ background: 'var(--surface-card)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--surface-border)', boxShadow: 'var(--box-shadow-glow)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <FiZap color="var(--accent-primary)" size={20} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px' }}>Audio Control</span>
                        </div>

                        <div style={{ display: 'flex', background: 'var(--background-color)', padding: '0.4rem', borderRadius: '12px', marginBottom: '2rem' }}>
                            {['original', 'processed'].map(v => (
                                <button 
                                    key={v}
                                    onClick={() => setAudioVersion(v)}
                                    style={{
                                        flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', 
                                        fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer',
                                        background: audioVersion === v ? 'var(--surface-panel)' : 'transparent',
                                        color: audioVersion === v ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {v.charAt(0).toUpperCase() + v.slice(1)}
                                </button>
                            ))}
                        </div>

                        <AudioPlayer src={getAudioSrc(audioVersion)} />

                        <div style={{ marginTop: '2.5rem' }}>
                            <p style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: '700', letterSpacing: '1px', marginBottom: '1rem' }}>RECORDING METADATA</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                    <span style={{ opacity: 0.6 }}>Format</span>
                                    <span style={{ fontWeight: '700' }}>44.1 kHz WAV</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                    <span style={{ opacity: 0.6 }}>Analysis Model</span>
                                    <span style={{ fontWeight: '700' }}>Whisper-v3-L</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                    <span style={{ opacity: 0.6 }}>Audio Cleanup</span>
                                    <span style={{ color: 'var(--success-color)', fontWeight: '700' }}>Enabled</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--surface-border)', opacity: 0.8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
                            <FiInfo />
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px' }}>Productivity Tip</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', lineHeight: '1.6', opacity: 0.6 }}>
                            Use the **Speaker Grid** tab to identify segments by different participants automatically.
                        </p>
                    </div>
                </div>

                {/* 3. MAIN CONTENT PANEL (TABS) */}
                <div style={{ background: 'var(--surface-card)', borderRadius: '32px', border: '1px solid var(--surface-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '800px' }}>
                    <div style={{ display: 'flex', background: 'var(--surface-panel)', borderBottom: '1px solid var(--surface-border)' }}>
                        {TABS.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabButtonStyle(activeTab === tab.id)}>
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '3rem', flex: 1 }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* TAB: AUDIO EXP */}
                                {activeTab === 'audio' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Audio Analysis</h2>
                                            <button style={actionButtonStyle}>
                                                <FiDownload /> Export Waveform Data
                                            </button>
                                        </div>
                                        <div style={{ padding: '4rem', background: 'var(--background-color)', borderRadius: '24px', border: '1px dashed var(--surface-border)', textAlign: 'center' }}>
                                            <FiHeadphones size={48} style={{ opacity: 0.2, marginBottom: '2rem', color: 'var(--accent-primary)' }} />
                                            <p style={{ fontSize: '0.95rem', opacity: 0.6, fontWeight: '500' }}>Interactive Audio Visualization System</p>
                                        </div>
                                    </div>
                                )}

                                {/* TAB: TRANSCRIPT */}
                                {activeTab === 'transcript' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Lecture Transcription</h2>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button style={actionButtonStyle} onClick={() => {
                                                    navigator.clipboard.writeText(transcript?.transcript_text || '');
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}>
                                                    {copied ? <FiCheck color="var(--success-color)" /> : <FiCopy />} Copy Text
                                                </button>
                                                <button style={actionButtonStyle}>
                                                    <FiDownload /> Export Markdown
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ 
                                            background: 'var(--background-color)', padding: '2.5rem', 
                                            borderRadius: '24px', border: '1px solid var(--surface-border)',
                                            lineHeight: '2.2', fontSize: '1rem', color: 'var(--text-secondary)',
                                            maxHeight: '1000px', overflowY: 'auto', whiteSpace: 'pre-wrap'
                                        }}>
                                            {transcript?.transcript_text || 'NO_DATA_AVAILABLE'}
                                        </div>
                                    </div>
                                )}

                                {/* TAB: DIARIZATION */}
                                {activeTab === 'diarization' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Speaker Highlights</h2>
                                            <button style={actionButtonStyle}>
                                                <FiLayers /> Symmetry Analysis
                                            </button>
                                        </div>
                                        <TranscriptViewer transcript={transcript} />
                                    </div>
                                )}

                                {/* TAB: AI LAB */}
                                {activeTab === 'quiz' && (
                                    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                        <div style={{ 
                                            width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', 
                                            borderRadius: '24px', display: 'flex', alignItems: 'center', 
                                            justifyContent: 'center', color: 'var(--accent-primary)',
                                            margin: '0 auto 2.5rem', border: '1px solid var(--accent-primary)'
                                        }}>
                                            <FiCpu size={40} />
                                        </div>
                                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>Generate Study Material</h2>
                                        <p style={{ maxWidth: '450px', margin: '0 auto 4rem', fontSize: '1.1rem', opacity: 0.6, lineHeight: '1.6' }}>
                                            Our AI engine will analyze the transcription to generate a concept-based MCQ assessment for your review.
                                        </p>
                                        
                                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                                            <div style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: '700', opacity: 0.5, display: 'block', marginBottom: '1rem' }}>Questions Count</label>
                                                <input 
                                                    type="number" 
                                                    value={numMCQs}
                                                    onChange={(e) => setNumMCQs(e.target.value)}
                                                    style={{ width: '100%', padding: '1rem', background: 'var(--background-color)', border: '1px solid var(--surface-border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '700', textAlign: 'center' }}
                                                />
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/quiz/${id}?n=${numMCQs}`)}
                                                style={{ 
                                                    width: '100%', padding: '1.25rem', background: 'var(--accent-primary)', 
                                                    border: 'none', borderRadius: '16px', color: '#fff', fontWeight: '700', 
                                                    fontSize: '1.1rem', cursor: 'pointer', boxShadow: 'var(--box-shadow-glow)' 
                                                }}
                                            >
                                                Start Assessment ({numMCQs})
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: var(--surface-border); border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: var(--accent-primary); }
            `}</style>
        </div>
    );
};

export default TranscriptPage;
