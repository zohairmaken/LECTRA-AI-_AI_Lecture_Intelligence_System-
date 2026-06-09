import React from 'react';
import { motion } from 'motion/react';
import { 
    FiHeadphones, FiFileText, FiCpu, FiShield, 
    FiLayers, FiActivity, FiZap, FiDatabase 
} from 'react-icons/fi';

const ServicesPage = () => {
    const services = [
        {
            icon: FiHeadphones,
            title: "VOICE_ISOLATION_PIPELINE",
            desc: "Advanced separation engine isolating frequency bands corresponding to human speech patterns.",
            tech: "DeepFilterNet + Demucs v4",
            stat: "99.2% NOISE_RED",
            color: "var(--accent-primary)"
        },
        {
            icon: FiFileText,
            title: "DATA_TRANSCRIPTION",
            desc: "Automated Speech Recognition with token-level timestamp alignment and context-aware punctuation.",
            tech: "Whisper-v3 Large",
            stat: "<5.4% WER",
            color: "var(--success-color)"
        },
        {
            icon: FiLayers,
            title: "SPEAKER_DIARIZATION_GRID",
            desc: "Vocal signature mapping to attribute text segments to specific speakers with sub-second accuracy.",
            tech: "Pyannote Audio 3.1",
            stat: "8+ SPEAKERS_MAX",
            color: "#bd00ff"
        },
        {
            icon: FiCpu,
            title: "GEN_AI_SYNTHESIS",
            desc: "Knowledge extraction layer providing automated Mcqs, chapter summaries, and concept mapping.",
            tech: "Qwen 2.5 7B",
            stat: "350ms LATENCY",
            color: "var(--error-color)"
        }
    ];

    return (
        <div style={{ padding: '8rem 2rem 12rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '950', letterSpacing: '-2px', marginBottom: '1.5rem' }}
                >
                    SYSTEM <span style={{ color: 'var(--accent-primary)' }}>INFRASTRUCTURE</span>
                </motion.h1>
                <p style={{ fontSize: '0.8rem', letterSpacing: '6px', opacity: 0.4, fontWeight: '900', textTransform: 'uppercase' }}>
                    OPERATIONAL_MOD_CAPABILITIES
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {services.map((s, i) => (
                    <motion.div
                        key={s.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'var(--surface-card)',
                            padding: '3.5rem',
                            borderRadius: '32px',
                            border: '1px solid var(--surface-border)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ 
                            position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', 
                            background: s.color, boxShadow: `0 0 15px ${s.color}66` 
                        }} />
                        
                        <div style={{ 
                            width: '60px', height: '60px', background: `${s.color}11`, 
                            borderRadius: '16px', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', color: s.color, marginBottom: '2.5rem',
                            border: `1px solid ${s.color}33`
                        }}>
                            <s.icon size={28} />
                        </div>

                        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '2px', marginBottom: '1.5rem' }}>{s.title}</h2>
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.8', opacity: 0.6, marginBottom: '2.5rem', minHeight: '5.4em' }}>{s.desc}</p>
                        
                        <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.65rem', letterSpacing: '2px', opacity: 0.4, fontWeight: '900' }}>CORE_ENGINE</div>
                                <div style={{ fontSize: '0.65rem', letterSpacing: '2px', color: s.color, fontWeight: '900' }}>{s.stat}</div>
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '800', marginTop: '0.5rem', letterSpacing: '1px' }}>{s.tech}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: '10rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                <div style={{ padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--surface-border)' }}>
                    <FiShield size={32} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>DATA_SOVEREIGNTY</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.5, lineHeight: '1.7' }}>All processing is sandboxed. User telemetry is encrypted at rest and in transit using military-grade AES-256 protocols.</p>
                </div>
                <div style={{ padding: '3rem', background: 'rgba(0,243,255,0.02)', borderRadius: '24px', border: '1px dashed var(--accent-primary)' }}>
                    <FiDatabase size={32} color="var(--success-color)" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>SECURE_PERSISTENCE</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.5, lineHeight: '1.7' }}>Persistent vector database integration allows for cross-session knowledge retrieval and semantic content search.</p>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
