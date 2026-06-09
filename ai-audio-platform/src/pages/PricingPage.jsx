import React from 'react';
import { motion } from 'motion/react';
import Button from '../components/common/Button';
import { FiCheck, FiZap, FiCpu, FiShield, FiStar } from 'react-icons/fi';

const PricingPage = () => {
    const plans = [
        {
            name: "OPERATOR",
            price: "FREE",
            desc: "For individual students and personal study sessions.",
            features: ["3 Lectures / Month", "Whisper Small ASR", "Basic Diarization", "10 MCQs per Quiz", "24h Data Retention"],
            icon: FiZap,
            color: "var(--text-muted)",
            cta: "START_SESSION",
            recommended: false
        },
        {
            name: "SCHOLAR",
            price: "$19/mo",
            desc: "For researchers and high-output students.",
            features: ["Unlimited Lectures", "Whisper Large-v3 ASR", "Advanced Speaker Mapping", "30 MCQs per Quiz", "Infinite Retention", "Priority Queueing"],
            icon: FiStar,
            color: "var(--accent-primary)",
            cta: "UPGRADE_MISSION",
            recommended: true
        },
        {
            name: "LABORATORY",
            price: "$99/mo",
            desc: "For institutional access and research labs.",
            features: ["Multi-user Seats (5)", "Custom Fine-tuned LLMs", "API Access", "Private Cloud Nodes", "Technical Support", "Semantic Knowledge Graph"],
            icon: FiCpu,
            color: "#bd00ff",
            cta: "CONTACT_LAB",
            recommended: false
        }
    ];

    return (
        <div style={{ padding: '8rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '950', letterSpacing: '-2px', marginBottom: '1.5rem' }}>
                    SELECT YOUR <span style={{ color: 'var(--accent-primary)' }}>CLEARANCE</span>
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.6, letterSpacing: '4px', textTransform: 'uppercase' }}>
                    SCALABLE_INTELLIGENCE_PLANS
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'var(--surface-card)',
                            padding: '4rem 3rem',
                            borderRadius: '32px',
                            border: `1px solid ${plan.recommended ? 'var(--accent-primary)' : 'var(--surface-border)'}`,
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: plan.recommended ? '0 20px 40px rgba(59, 130, 246, 0.1)' : 'none',
                        }}
                    >
                        {plan.recommended && (
                            <div style={{
                                position: 'absolute', top: '1.5rem', right: '1.5rem',
                                background: 'var(--accent-primary)', color: '#fff',
                                padding: '0.4rem 1rem', borderRadius: '20px',
                                fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px'
                            }}>RECOMMENDED</div>
                        )}

                        <div style={{ 
                            width: '60px', height: '60px', background: `${plan.color}11`,
                            borderRadius: '16px', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', color: plan.color, marginBottom: '2.5rem',
                            border: `1px solid ${plan.color}33`
                        }}>
                            <plan.icon size={30} />
                        </div>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', marginBottom: '0.5rem' }}>{plan.name}</h2>
                        <div style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '1rem' }}>{plan.price}</div>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '3rem', minHeight: '3em' }}>{plan.desc}</p>

                        <div style={{ flex: 1, marginBottom: '4rem' }}>
                            <p style={{ fontSize: '0.75rem', letterSpacing: '2px', opacity: 0.3, fontWeight: '900', marginBottom: '1.5rem' }}>INCLUDED_FEATURES</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {plan.features.map(f => (
                                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                                        <FiCheck size={16} color="var(--success-color)" /> {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button 
                            variant={plan.recommended ? 'primary' : 'secondary'} 
                            style={{ width: '100%', padding: '1.25rem' }}
                        >
                            {plan.cta}
                        </Button>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: '8rem', textAlign: 'center', opacity: 0.4 }}>
                <p style={{ fontSize: '0.8rem', letterSpacing: '2px' }}><FiShield style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> ALL TRANSACTIONS ENCRYPTED VIA QUANTUM-SECURE PIPELINE</p>
            </div>
        </div>
    );
};

export default PricingPage;
