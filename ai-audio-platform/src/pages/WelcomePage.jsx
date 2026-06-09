import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from '../components/common/Button';
import RotatingText from '../components/react-bits/RotatingText/RotatingText';
import { 
    FiCpu, FiHeadphones, FiFileText, FiLayers, FiShield, FiGithub, 
    FiLinkedin, FiMail, FiMessageSquare, FiTrendingUp, FiCheckCircle, 
    FiCloud, FiZap, FiArrowRight, FiTarget, FiHelpCircle, FiChevronDown
} from 'react-icons/fi';

const WelcomePage = () => {
    const navigate = useNavigate();

    // Smooth scroll handler
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const sectionTitleStyle = {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '1rem',
        letterSpacing: '-0.02em',
        color: 'var(--text-primary)'
    };

    const sectionSubStyle = {
        textAlign: 'center',
        color: 'var(--accent-primary)',
        fontSize: '0.85rem',
        letterSpacing: '2px',
        fontWeight: '700',
        marginBottom: '4rem',
        textTransform: 'uppercase'
    };

    const cardStyle = {
        background: 'var(--surface-card)',
        padding: '3rem',
        borderRadius: '24px',
        border: '1px solid var(--surface-border)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
    };

    // Product Mockup Path
    const MOCKUP_PATH = '/C:/Users/zohai/.gemini/antigravity/brain/e58b09b8-72b1-42c1-8986-716502224b48/lectra_ai_product_preview_1775942838060.png';

    return (
        <div style={{ background: 'var(--background-color)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
            {/* 1. HERO SECTION */}
            <section id="hero" style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                position: 'relative',
                padding: '10rem 2rem 5rem'
            }}>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ zIndex: 1, textAlign: 'center', maxWidth: '1100px' }}
                >
                    <div style={{ 
                        padding: '0.4rem 1.25rem', 
                        background: 'rgba(79, 70, 229, 0.08)', 
                        border: '1px solid rgba(79, 70, 229, 0.2)',
                        borderRadius: '100px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        marginBottom: '2rem',
                        color: 'var(--accent-primary)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        letterSpacing: '1px'
                    }}>
                        <FiCheckCircle size={14} /> SYSTEM_VERIFIED
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                        fontWeight: '900',
                        marginBottom: '1.5rem',
                        lineHeight: '1',
                        letterSpacing: '-0.04em',
                        fontFamily: 'var(--font-family-display)',
                        color: 'var(--text-primary)'
                    }}>
                        LECTRA
                    </h1>
                    
                    <div style={{ fontSize: 'clamp(1rem, 3vw, 1.75rem)', marginBottom: '3rem', opacity: 0.9, fontWeight: '500', minHeight: '1.5em' }}>
                        <RotatingText
                            texts={['High-Fidelity Transcription', 'Automated Lecture Summaries', 'Interactive Study Tools']}
                            mainClassName="justify-center"
                        />
                    </div>

                    <p style={{ maxWidth: '800px', margin: '0 auto 4rem', fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                        Transform high-noise academic recordings into high-fidelity transcripts and structured learning nodes. 
                        Powered by a state-of-the-art Python backend and modern neuro-processing.
                    </p>

                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button 
                            variant="primary" 
                            size="large" 
                            onClick={() => navigate('/dashboard')}
                            style={{ padding: '1.25rem 3.5rem', fontSize: '1.1rem', fontWeight: '700' }}
                        >
                            LAUNCH PLATFORM
                        </Button>
                        <Button 
                            variant="secondary" 
                            size="large" 
                            onClick={() => navigate('/auth')}
                            style={{ padding: '1.25rem 3.5rem', fontSize: '1.1rem', fontWeight: '700' }}
                        >
                            GET STARTED
                        </Button>
                    </div>

                    <div style={{ marginTop: '5rem', opacity: 0.4, animation: 'bounce 3s infinite' }}>
                        <FiChevronDown size={32} />
                    </div>
                </motion.div>
            </section>

            {/* 2. STATS SECTION */}
            <section style={{ padding: '5rem 2rem', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-card)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                    {[
                        { label: 'ACCURACY', value: '98.4%', icon: <FiTarget color="var(--accent-primary)" /> },
                        { label: 'PROCESSING SPEED', value: '0.2x Realtime', icon: <FiZap color="var(--accent-primary)" /> },
                        { label: 'DATA SECURITY', value: 'ENCRYPTED', icon: <FiShield color="var(--accent-primary)" /> },
                        { label: 'ML MODELS', value: '4 ACTIVE', icon: <FiCpu color="var(--accent-primary)" /> }
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 20 }}
                            viewport={{ once: true }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                        >
                            <div style={{ fontSize: '1.5rem' }}>{stat.icon}</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.75rem', letterSpacing: '2px', opacity: 0.5, fontWeight: '700' }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. PRODUCT PREVIEW SECTION */}
            <section style={{ padding: '12rem 2rem', position: 'relative' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <h2 style={sectionTitleStyle}>OPERATIONAL INTERFACE</h2>
                        <p style={sectionSubStyle}>VISUAL_ANALYTICS</p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        style={{ 
                            position: 'relative',
                            padding: '0.5rem',
                            background: 'var(--surface-border)',
                            borderRadius: '24px',
                            boxShadow: 'var(--box-shadow-glow)'
                        }}
                    >
                        <img 
                            src={MOCKUP_PATH} 
                            alt="Lectra-AI Dashboard" 
                             style={{ 
                                width: '100%', 
                                borderRadius: '18px', 
                                display: 'block',
                                background: 'var(--background-color)'
                            }} 
                        />
                    </motion.div>
                </div>
            </section>

            {/* 4. CORE PIPELINE (SERVICES) */}
            <section id="services" style={{ padding: '5rem 2rem 12rem', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 style={sectionTitleStyle}>THE CORE PIPELINE</h2>
                    <p style={sectionSubStyle}>PROCESSING_STAGES</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                    {[
                        { 
                            icon: <FiHeadphones size={32} />, 
                            title: 'VOICE ISOLATION', 
                            desc: 'DeepFilterNet + Demucs hybrid architecture for superior noise floor removal.',
                            tags: ['CNN', 'U-Net']
                        },
                        { 
                            icon: <FiLayers size={32} />, 
                            title: 'DIARIZATION', 
                            desc: 'Pyannote Speaker Identification to attribute transcripts to specific speakers accurately.',
                            tags: ['X-Vectors', 'Clustering']
                        },
                        { 
                            icon: <FiFileText size={32} />, 
                            title: 'TRANSCRIPTION', 
                            desc: 'OpenAI Whisper integration with timestamp alignment and punctuation reconstruction.',
                            tags: ['Transformer', 'ASR']
                        },
                        { 
                            icon: <FiCpu size={32} />, 
                            title: 'LLM ANALYTICS', 
                            desc: 'Knowledge extraction using Qwen LLM for quizzes, summaries, and key concept mapping.',
                            tags: ['Generative AI', 'RAG']
                        },
                        { 
                            icon: <FiTrendingUp size={32} />, 
                            title: 'KNOWLEDGE HUB', 
                            desc: 'Persistent storage for all processed sessions with semantic search capabilities.',
                            tags: ['Searchable', 'Organized']
                        },
                        { 
                            icon: <FiShield size={32} />, 
                            title: 'PRIVACY FIRST', 
                            desc: 'Local-first processing logic ensures sensitive academic data never leaves secure zones.',
                            tags: ['Encrypted', 'Local-ML']
                        }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                            viewport={{ once: true }}
                            className="service-card" 
                            style={cardStyle}
                        >
                            <div style={{ 
                                width: '60px', height: '60px', background: 'var(--surface-panel)', 
                                borderRadius: '12px', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', color: 'var(--accent-primary)',
                                marginBottom: '2rem', border: '1px solid var(--surface-border)'
                            }}>
                                {item.icon}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: '800' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2rem', flex: 1 }}>{item.desc}</p>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {item.tags.map(tag => (
                                    <span key={tag} style={{ fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--accent-primary)', fontWeight: '900', border: '1px solid var(--accent-primary)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 5. TECH STACK SECTION */}
            <section style={{ padding: '12rem 2rem', background: 'var(--surface-card)', borderTop: '1px solid var(--surface-border)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={sectionTitleStyle}>TECH ARCHITECTURE</h2>
                    <p style={sectionSubStyle}>POWERING_INTELLIGENCE</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4rem', opacity: 0.6 }}>
                        {['PYTHON', 'PYTORCH', 'REACT', 'POSTGRESQL', 'FASTAPI', 'VITE'].map(tech => (
                            <div key={tech} style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '2px' }}>{tech}</div>
                        ))}
                    </div>

                    <div style={{ marginTop: '8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
                        <div style={{ textAlign: 'left', padding: '2rem', background: 'var(--background-color)', borderRadius: '24px' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
                            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>WHISPER ENGINE</h4>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Multi-lingual speech recognition model providing near-human accuracy in English and 90+ other languages.</p>
                        </div>
                        <div style={{ textAlign: 'left', padding: '2rem', background: 'var(--background-color)', borderRadius: '24px' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎙️</div>
                            <h4 style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>PYANNOTE AI</h4>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>State-of-the-art toolkit for speaker diarization, automatically separating teacher from student voices.</p>
                        </div>
                        <div style={{ textAlign: 'left', padding: '2rem', background: 'var(--background-color)', borderRadius: '24px' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</div>
                            <h4 style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>QWEN 2.5</h4>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Our core LLM for knowledge synthesis, capable of reasoning and structured output generation.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FAQ SECTION */}
            <section id="faq" style={{ padding: '12rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 style={sectionTitleStyle}>FAQ</h2>
                    <p style={sectionSubStyle}>USER_GUIDE</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                        { q: "HOW ACCURATE IS THE TRANSCRIPTION?", a: "We leverage the latest Whisper Large-v3 model, achieving <5% Word Error Rate in standard academic environments." },
                        { q: "IS MY DATA SECURE ON YOUR SERVER?", a: "All processing is session-based. We do not use your data for training. Files are purged post-processing per your preference." },
                        { q: "CAN IT PROCESS VIDEOS?", a: "Yes. MP4 and MKV formats are supported. Our pipeline extracts audio for processing automatically." },
                        { q: "IS THERE A FILE SIZE LIMIT?", a: "Currently, we support files up to 100MB directly. For larger files, we recommend pre-splitting or lower bitrate formats." }
                    ].map((faq, i) => (
                        <div key={i} style={{ padding: '2rem', background: 'var(--surface-card)', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                                <FiHelpCircle /> {faq.q}
                            </div>
                            <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: '1.6', paddingLeft: '1.8rem' }}>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. CTA / DEVELOPER Bio */}
            <section id="about" style={{ padding: '12rem 2rem', background: 'linear-gradient(to bottom, transparent, var(--surface-card))' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '6rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '2rem', lineHeight: '1.1' }}>CREATING THE FUTURE OF<br/><span style={{ color: 'var(--accent-primary)' }}>EDUCATION TECH</span></h2>
                            <p style={{ fontSize: '1.25rem', opacity: 0.7, lineHeight: '1.8', marginBottom: '3rem' }}>
                                I’m **Zohair Hasnain Maken**, an ML Engineer dedicated to bridge the gap between complex AI and user-centric education. Lectra-AI is built to solve the frustration of messy, unstructured lectures.
                            </p>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: '900' }}>FAST NUCES</span>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>AI_GRADUATE</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: '900' }}>AI RESEARCH</span>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>FIELD_EXPERTISE</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: '40px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>READY TO BEGIN?</h3>
                            <p style={{ opacity: 0.6, marginBottom: '3rem' }}>Join the next generation of automated learning.</p>
                            <Button variant="primary" size="large" onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '1.5rem', fontSize: '1.2rem' }}>
                                GET STARTED NOW <FiArrowRight style={{ marginLeft: '1rem' }} />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. FOOTER */}
            <footer style={{ padding: '8rem 2rem', background: 'var(--background-color)', borderTop: '1px solid var(--surface-border)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ width: '40px', height: '40px', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', borderRadius: '8px', fontSize: '1.25rem' }}>L</div>
                                <span style={{ fontWeight: '900', letterSpacing: '4px', fontSize: '1.5rem' }}>LECTRA-AI</span>
                            </div>
                            <p style={{ maxWidth: '300px', opacity: 0.5, lineHeight: '1.8' }}>
                                Automating academic intelligence. Transcribing the future of classroom interaction.
                            </p>
                        </div>
                        
                        <div>
                            <h4 style={{ marginBottom: '2rem', fontSize: '0.8rem', letterSpacing: '3px', opacity: 0.4 }}>PRODUCT</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <a href="#hero" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.6 }}>Dashboard</a>
                                <a href="#services" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.6 }}>Pipeline</a>
                                <a href="/upload" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.6 }}>Upload Console</a>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ marginBottom: '2rem', fontSize: '0.8rem', letterSpacing: '3px', opacity: 0.4 }}>RESOURCES</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <a href="#faq" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.6 }}>Documentation</a>
                                <a href="#" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.6 }}>AI Governance</a>
                                <a href="#" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.6 }}>Privacy Protocol</a>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ marginBottom: '2rem', fontSize: '0.8rem', letterSpacing: '3px', opacity: 0.4 }}>CONNECT</h4>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <a href="#" style={{ color: 'var(--text-primary)', opacity: 0.6 }}><FiLinkedin size={24} /></a>
                                <a href="#" style={{ color: 'var(--text-primary)', opacity: 0.6 }}><FiGithub size={24} /></a>
                                <a href="#" style={{ color: 'var(--text-primary)', opacity: 0.6 }}><FiMail size={24} /></a>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '4rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
                        <p style={{ opacity: 0.4, fontSize: '0.8rem', letterSpacing: '1px' }}>
                            © 2024 LECTRA-AI PLATFORM. OPERATIONAL.
                        </p>
                        <p style={{ opacity: 0.4, fontSize: '0.8rem', letterSpacing: '1px' }}>
                            DESIGNED & ARCHITECTED BY **ZOHAIR HASSNAIN MAKEN**
                        </p>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                }
                .service-card:hover {
                    transform: translateY(-12px);
                    border-color: var(--accent-primary) !important;
                    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1) !important;
                }
                a:hover {
                    opacity: 1 !important;
                    color: var(--accent-primary) !important;
                }
                ::-webkit-scrollbar {
                    width: 10px;
                }
                ::-webkit-scrollbar-track {
                    background: var(--background-color);
                }
                ::-webkit-scrollbar-thumb {
                    background: var(--surface-border);
                    border-radius: 5px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: var(--accent-primary);
                }
            `}</style>
        </div>
    );
};

export default WelcomePage;
