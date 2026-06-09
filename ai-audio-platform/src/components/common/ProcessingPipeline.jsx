import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiFilter, FiMic, FiUsers, FiCpu, FiDatabase, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const PIPELINE_STEPS = [
    { id: 'Queued', label: 'QUEUED', icon: <FiDatabase />, color: 'var(--text-muted)' },
    {
        id: 'Noise',
        label: 'NOISE REMOVAL',
        icon: <FiFilter />,
        color: 'var(--accent-primary)',
        triggers: ['Isolating Vocals', 'Removing Noise', 'Finalizing Audio', 'Preprocessing']
    },
    {
        id: 'Diarizing',
        label: 'SPEAKER DIARIZATION',
        icon: <FiUsers />,
        color: 'var(--warning-color)',
        triggers: ['Diarizing', 'Identifying Teacher']
    },
    {
        id: 'Transcribing',
        label: 'WHISPER TRANSCRIPTION',
        icon: <FiMic />,
        color: '#bd00ff',
        triggers: ['Transcribing', 'Merging Data']
    },
    {
        id: 'Synthesizing',
        label: 'AI ANALYSIS',
        icon: <FiCpu />,
        color: '#05ffa1',
        triggers: ['Analyzing', 'Organizing']
    },
    { id: 'Completed', label: 'COMPLETE', icon: <FiCheckCircle />, color: 'var(--success-color)' },
];

const ProcessingPipeline = ({ currentStatus = 'Queued', onComplete }) => {
    const [hasCalledComplete, setHasCalledComplete] = useState(false);

    const activeIndex = PIPELINE_STEPS.findIndex(s =>
        s.id === currentStatus || (s.triggers && s.triggers.includes(currentStatus))
    );

    const isFailed = currentStatus === 'Failed' || currentStatus?.startsWith('Failed:');
    const isCompleted = currentStatus === 'Completed';

    useEffect(() => {
        if (isCompleted && !hasCalledComplete && onComplete) {
            setHasCalledComplete(true);
            setTimeout(onComplete, 800);
        }
    }, [isCompleted, hasCalledComplete, onComplete]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2.5rem',
            padding: '3.5rem 2rem',
            width: '100%',
            background: 'var(--surface-card)',
            border: '1px solid var(--surface-border)',
            borderRadius: '24px',
            boxShadow: 'var(--box-shadow-glow)'
        }}>
            <h3 style={{
                marginBottom: '1rem',
                letterSpacing: '5px',
                fontSize: '0.85rem',
                fontWeight: '900',
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--surface-border)',
                paddingBottom: '1.25rem',
                width: '100%',
                textAlign: 'center',
                textTransform: 'uppercase'
            }}>
                DATA PROCESSING SEQUENCE
            </h3>

            {isFailed ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem',
                        padding: '3rem', background: 'rgba(255, 42, 109, 0.05)',
                        border: '1px solid var(--error-color)', borderRadius: '16px'
                    }}
                >
                    <FiAlertTriangle size={48} color="var(--error-color)" />
                    <span style={{ color: 'var(--error-color)', fontWeight: '900', letterSpacing: '3px', fontSize: '1.1rem' }}>CRITICAL FAILURE</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                        {currentStatus?.includes(':') ? currentStatus.split(':').pop().toUpperCase() : 'PIPELINE_EXECUTION_INTERRUPTED'}
                    </span>
                </motion.div>
            ) : (
                <div style={{
                    display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center',
                    flexWrap: 'nowrap', width: '100%', maxWidth: '1000px', overflowX: 'auto', padding: '1rem'
                }}>
                    <AnimatePresence mode="wait">
                        {PIPELINE_STEPS.map((step, index) => {
                            const isActive = index === activeIndex;
                            const isDone = (activeIndex > index) || isCompleted;
                            const isPending = activeIndex === -1 || index > activeIndex;

                            return (
                                <React.Fragment key={step.id}>
                                    {index > 0 && (
                                        <div style={{
                                            flex: 1, minWidth: '20px', height: '2px',
                                            background: isDone ? 'var(--success-color)' : 'var(--surface-border)',
                                            transition: 'background 0.5s ease',
                                            opacity: isPending ? 0.3 : 1
                                        }} />
                                    )}
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{
                                            opacity: isPending ? 0.4 : 1,
                                            scale: isActive ? 1.15 : 1,
                                        }}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            width: '130px',
                                            padding: '1.5rem 0.5rem',
                                            borderRadius: '16px',
                                            background: isActive ? 'var(--surface-panel)' : 'transparent',
                                            border: `1px solid ${isActive ? 'var(--accent-primary)' : isDone ? 'var(--success-color)' : 'var(--surface-border)'}`,
                                            position: 'relative',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{
                                            fontSize: '2rem',
                                            color: isDone ? 'var(--success-color)' : isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                                            transition: 'color 0.4s ease'
                                        }}>
                                            {isDone ? <FiCheckCircle /> : step.icon}
                                        </div>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: '800',
                                            textAlign: 'center',
                                            color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                            letterSpacing: '1.5px',
                                            lineHeight: '1.2',
                                            textTransform: 'uppercase'
                                        }}>
                                            {step.label}
                                        </span>

                                        {isActive && (
                                            <motion.div
                                                animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.02, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                style={{
                                                    position: 'absolute', inset: -4,
                                                    borderRadius: '20px',
                                                    border: '2px solid var(--accent-primary)',
                                                    zIndex: -1
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                </React.Fragment>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            <div style={{
                marginTop: '1.5rem',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                letterSpacing: '3px',
                fontWeight: '900',
                fontFamily: 'monospace',
                background: 'var(--surface-panel)',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                border: '1px solid var(--surface-border)'
            }}>
                {isFailed ? (
                    <span style={{ color: 'var(--error-color)' }}>[ERROR] PIPELINE_CRASHED</span>
                ) : isCompleted ? (
                    <span style={{ color: 'var(--success-color)' }}>[SUCCESS] PROCESSING_COMPLETE</span>
                ) : activeIndex >= 0 ? (
                    <motion.span
                        key={currentStatus}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {`> ${currentStatus?.toUpperCase() || ''}...`}
                    </motion.span>
                ) : (
                    <span>[SYS] INITIALIZING_DATA_PIPELINE...</span>
                )}
            </div>
        </div>
    );
};

export default ProcessingPipeline;
