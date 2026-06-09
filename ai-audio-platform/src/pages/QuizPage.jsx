import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { generateQuiz, submitQuiz } from '../services/quizService';
import { 
    FiCheckCircle, FiXCircle, FiAward, FiArrowRight, 
    FiBookOpen, FiHelpCircle, FiEye, FiEyeOff, FiZap, FiTarget 
} from 'react-icons/fi';

const QuizPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [quizId, setQuizId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [revealedAnswers, setRevealedAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const numQuestions = parseInt(searchParams.get('n')) || 5;

                const data = await generateQuiz(id, { 
                    num_questions: numQuestions,
                    force: true 
                });
                
                setQuizId(data.id);
                setQuestions((data.questions || []).map((q, idx) => ({
                    id: idx,
                    type: q.type || 'mcq',
                    text: q.question,
                    options: q.options || [],
                    answer: q.answer,
                    topic: q.topic || ''
                })));
            } catch (err) {
                console.error('[Quiz] Generation failed:', err);
                setError('MISSION_CRITICAL_FAILURE: COULD_NOT_INITIALIZE_ASSESSMENT_DATA');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id, location.search]);

    const handleOptionSelect = (qIdx, option) => {
        setAnswers(prev => ({ ...prev, [qIdx]: option }));
    };

    const handleSubmit = async () => {
        if (!quizId) return;
        setSubmitting(true);
        try {
            const answerMap = {};
            questions.filter(q => q.type === 'mcq').forEach((q) => {
                answerMap[String(q.id)] = answers[q.id] || '';
            });
            const evalResult = await submitQuiz(quizId, answerMap);
            setResult(evalResult);
        } catch (err) {
            setError('SUBMISSION_FAILED: UPLINK_INTERRUPTED');
        } finally {
            setSubmitting(false);
        }
    };

    const mcqQuestions = questions.filter(q => q.type === 'mcq');
    const progress = Math.round((Object.keys(answers).length / mcqQuestions.length) * 100) || 0;

    if (loading) return (
        <div style={{ padding: '10rem', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', border: '3px solid var(--surface-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }} />
            <p style={{ letterSpacing: '4px', fontSize: '0.8rem', opacity: 0.5 }}>PREPARING_STUDY_MATERIAL...</p>
        </div>
    );

    return (
        <div style={{ padding: '4rem 2rem 12rem', maxWidth: '900px', margin: '0 auto' }}>
            {/* Header / Briefing */}
            <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <div style={{ display: 'inline-flex', padding: '0.5rem 1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '30px', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '3px', marginBottom: '2rem' }}>
                    <FiZap style={{ marginRight: '0.75rem' }} /> ACTIVE_MISSION_PROTOCOL
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '950', letterSpacing: '-1px' }}>
                    {result ? 'ASSESSMENT_COMPLETE' : 'KNOWLEDGE_ASSESSMENT'}
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.4, letterSpacing: '2px', fontWeight: '500' }}>
                    LECTRA_ASSESSMENT_SYSTEM
                </p>
            </header>

            {/* Error / Results logic */}
            {error && <div style={{ padding: '3rem', background: 'var(--error-color)11', border: '1px solid var(--error-color)', borderRadius: '24px', color: 'var(--error-color)', textAlign: 'center' }}>{error}</div>}

            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {/* Progress Bar */}
                        <div style={{ position: 'sticky', top: '2rem', zIndex: 10, background: 'var(--surface-card)', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid var(--surface-border)', marginBottom: '4rem', boxShadow: 'var(--box-shadow-glow)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '2px', marginBottom: '1rem', opacity: 0.5 }}>
                                <span>COMPLETION_INDEX</span>
                                <span>{progress}%</span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--background-color)', borderRadius: '2px', overflow: 'hidden' }}>
                                <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }} />
                            </div>
                        </div>

                        {/* Questions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {questions.map((q, idx) => (
                                <motion.div 
                                    key={q.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-100px' }}
                                    style={{ background: 'var(--surface-card)', padding: '4rem 3.5rem', borderRadius: '32px', border: '1px solid var(--surface-border)', position: 'relative' }}
                                >
                                    <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', opacity: 0.3 }}>Q_{idx+1}</div>
                                    <h3 style={{ fontSize: '1.35rem', fontWeight: '700', lineHeight: '1.5', marginBottom: '3rem' }}>{q.text}</h3>

                                    {q.type === 'mcq' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {q.options.map((opt, optIdx) => {
                                                const active = answers[idx] === opt;
                                                return (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleOptionSelect(idx, opt)}
                                                        style={{
                                                            padding: '1.5rem 2rem', borderRadius: '16px', textAlign: 'left',
                                                            background: active ? 'rgba(59, 130, 246, 0.1)' : 'var(--background-color)',
                                                            border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--surface-border)'}`,
                                                            color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                                                            cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            display: 'flex', alignItems: 'center', gap: '1.5rem'
                                                        }}
                                                    >
                                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${active ? 'var(--accent-primary)' : 'var(--surface-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {active && <div style={{ width: '10px', height: '10px', background: 'var(--accent-primary)', borderRadius: '50%' }} />}
                                                        </div>
                                                        <span style={{ fontWeight: active ? '700' : '500' }}>{opt}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{ padding: '2rem', background: 'var(--background-color)', borderRadius: '16px', border: '1px dashed var(--surface-border)', textAlign: 'center' }}>
                                            <FiArrowRight size={32} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                                            <p style={{ fontSize: '0.85rem', opacity: 0.4 }}>CONCEPTUAL_MAPPING_REQUIRED</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Submit */}
                        <div style={{ marginTop: '8rem', textAlign: 'center' }}>
                            <button
                                onClick={handleSubmit}
                                disabled={progress < 100 || submitting}
                                style={{
                                    padding: '1.5rem 5rem', borderRadius: '20px', background: progress === 100 ? 'var(--accent-primary)' : 'var(--surface-border)',
                                    color: '#fff', border: 'none', cursor: progress === 100 ? 'pointer' : 'not-allowed',
                                    fontSize: '1rem', fontWeight: '950', letterSpacing: '4px', boxShadow: progress === 100 ? '0 20px 40px rgba(59, 130, 246, 0.3)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {submitting ? 'PROCESSING_EVALUATION' : 'FINALIZE_MISSION'}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ background: 'var(--surface-card)', padding: '5rem', borderRadius: '40px', border: `2px solid ${result.score >= 70 ? 'var(--success-color)' : 'var(--error-color)'}`, textAlign: 'center', marginBottom: '5rem' }}>
                            <div style={{ width: '100px', height: '100px', background: result.score >= 70 ? 'var(--success-color)11' : 'var(--error-color)11', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3rem', border: `1px solid ${result.score >= 70 ? 'var(--success-color)' : 'var(--error-color)'}33` }}>
                                <FiAward size={48} color={result.score >= 70 ? 'var(--success-color)' : 'var(--error-color)'} />
                            </div>
                            <h2 style={{ fontSize: '4rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '0.5rem' }}>{result.score}%</h2>
                            <p style={{ fontSize: '0.8rem', opacity: 0.4, letterSpacing: '4px', fontWeight: '900', textTransform: 'uppercase' }}>MASTERY_REACHED</p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                            <Button variant="primary" size="large" onClick={() => navigate('/learning-hub')} style={{ padding: '1.25rem 3rem' }}>VIEW_INTELLIGENCE_PROFILE</Button>
                            <Button variant="secondary" size="large" onClick={() => navigate('/dashboard')} style={{ padding: '1.25rem 3rem' }}>EXIT_INTERFACE</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default QuizPage;
