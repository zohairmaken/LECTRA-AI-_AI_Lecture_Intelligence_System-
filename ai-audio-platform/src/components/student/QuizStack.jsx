import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiCpu, FiGlobe, FiMusic, FiCode, FiArrowRight } from 'react-icons/fi';

const QuizStack = () => {
    const navigate = useNavigate();

    const quizzes = [
        { id: 'physics-101', title: 'PHYSICS 101: THERMODYNAMICS', icon: <FiGlobe />, color: '#00f3ff' },
        { id: 'ai-ethics', title: 'AI ETHICS & MORALITY', icon: <FiCpu />, color: '#bd00ff' },
        { id: 'music-theory', title: 'MUSIC THEORY: HARMONY', icon: <FiMusic />, color: '#ffe600' },
        { id: 'history-code', title: 'HISTORY OF COMPUTING', icon: <FiCode />, color: '#05ffa1' },
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '2rem',
            alignItems: 'center'
        }}>
            {quizzes.map((quiz, index) => (
                <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                        scale: 1.02,
                        x: 20,
                        backgroundColor: 'rgba(255,255,255,0.1)'
                    }}
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        padding: '1.5rem',

                        /* Stacked Look */
                        background: 'rgba(20, 20, 30, 0.6)',
                        borderLeft: `4px solid ${quiz.color}`,
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',

                        borderRadius: '0 12px 12px 0',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            fontSize: '2rem',
                            color: quiz.color,
                            opacity: 0.8
                        }}>
                            {quiz.icon}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>{quiz.title}</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>// MODULE_ID: {quiz.id.toUpperCase()}</span>
                        </div>
                    </div>

                    <div style={{
                        color: quiz.color,
                        fontSize: '1.5rem',
                        opacity: 0.5
                    }}>
                        <FiArrowRight />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default QuizStack;
