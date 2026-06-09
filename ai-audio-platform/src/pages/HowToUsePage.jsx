import React from 'react';
import { motion } from 'motion/react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { 
    FiUploadCloud, FiClock, FiSettings, 
    FiCheckCircle, FiChevronRight, FiShield, FiCpu 
} from 'react-icons/fi';

const HowToUsePage = () => {
    const navigate = useNavigate();

    const steps = [
        {
            icon: FiUploadCloud,
            title: "STAGE_01: SOURCE_INGESTION",
            desc: "Initialize by uploading your raw audio or video files (MP4, MP3, WAV). Our pre-processors immediately begin signal validation.",
            tag: "INPUT"
        },
        {
            icon: FiSettings,
            title: "STAGE_02: DATA_PROCESSING",
            desc: "The pipeline triggers Demucs for background noise isolation and Whisper for high-fidelity transcription concurrently.",
            tag: "COMPUTE"
        },
        {
            icon: FiClock,
            title: "STAGE_03: DIARIZATION_SYNC",
            desc: "Speak signatures are mapped. You can monitor the progress in the Command Center as timestamps and speakers are identified.",
            tag: "VALIDATE"
        },
        {
            icon: FiCheckCircle,
            title: "STAGE_04: INTELLIGENCE_OUTPUT",
            desc: "Access the final transcript, download cleaned audio, or initiate AI-driven Quiz generation for cognitive assessment.",
            tag: "DEPLOY"
        }
    ];

    return (
        <div style={{ padding: '8rem 2rem 12rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '950', letterSpacing: '-2px', marginBottom: '1.5rem' }}
                >
                    OPERATIONAL <span style={{ color: 'var(--accent-primary)' }}>WORKFLOW</span>
                </motion.h1>
                <p style={{ fontSize: '0.8rem', letterSpacing: '6px', opacity: 0.4, fontWeight: '900', textTransform: 'uppercase' }}>
                    LECTRA_CORE_GUIDE
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '10rem' }}>
                {steps.map((s, i) => (
                    <motion.div
                        key={s.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'var(--surface-card)',
                            padding: '3rem',
                            borderRadius: '24px',
                            border: '1px solid var(--surface-border)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ 
                                width: '50px', height: '50px', background: 'rgba(59, 130, 246, 0.1)', 
                                borderRadius: '12px', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', color: 'var(--accent-primary)' 
                            }}>
                                <s.icon size={24} />
                            </div>
                            <span style={{ fontSize: '0.6rem', fontWeight: '900', letterSpacing: '2px', opacity: 0.4 }}>{s.tag}</span>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.5rem' }}>{s.title}</h3>
                        <p style={{ fontSize: '0.95rem', opacity: 0.6, lineHeight: '1.8', flex: 1 }}>{s.desc}</p>
                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: '900' }}>
                            GUIDE_SECTION <FiChevronRight />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ 
                background: 'var(--surface-card)', 
                padding: '5rem', 
                borderRadius: '40px', 
                border: '1px solid var(--surface-border)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05 }}>
                    <FiCpu size={300} color="var(--accent-primary)" />
                </div>
                
                <h2 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '1.5rem' }}>READY_TO_START?</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.1rem', opacity: 0.6, lineHeight: '1.6' }}>
                    Access the most advanced audio processing tools available. Start transcribing your academic sessions today.
                </p>
                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                    <Button variant="primary" size="large" onClick={() => navigate('/dashboard')} style={{ padding: '1.25rem 4rem' }}>
                        LAUNCH_DASHBOARD
                    </Button>
                    <Button variant="secondary" size="large" onClick={() => navigate('/services')} style={{ padding: '1.25rem 4rem' }}>
                        VIEW_SERVICES
                    </Button>
                </div>
            </div>

            <div style={{ marginTop: '8rem', display: 'flex', justifyContent: 'center', gap: '5rem', opacity: 0.3 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2px' }}><FiShield /> ENCRYPTED_SESSIONS</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2px' }}><FiCpu /> LOCAL_INFERENCE</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2px' }}><FiClock /> 99.9%_UPTIME</div>
            </div>
        </div>
    );
};

export default HowToUsePage;
