import React from 'react';
import { FiAward, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const QuizResult = ({ result }) => {
    if (!result) return null;

    const scoreColor = result.score >= 80 ? '#0f0' : result.score >= 50 ? '#ffe600' : '#ff2a6d';

    return (
        <div className="quiz-result" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <FiAward size={40} color={scoreColor} style={{ marginBottom: '1rem' }} />
            <h2 style={{ letterSpacing: '3px', fontSize: '1rem', marginBottom: '1rem', opacity: 0.7 }}>
                ASSESSMENT RESULTS
            </h2>
            <div style={{
                fontSize: '4rem', fontWeight: '900', marginBottom: '0.5rem',
                background: `linear-gradient(135deg, ${scoreColor}, #00f3ff)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
                {result.score}%
            </div>
            <p style={{ opacity: 0.6, letterSpacing: '1px', fontSize: '0.9rem' }}>
                {result.correctAnswers} out of {result.totalQuestions} correct
            </p>

            {/* Score bar */}
            <div style={{
                width: '100%', maxWidth: '300px', height: '6px',
                background: 'rgba(255,255,255,0.1)', borderRadius: '3px',
                margin: '1.5rem auto 0', overflow: 'hidden'
            }}>
                <div style={{
                    width: `${result.score}%`, height: '100%',
                    background: `linear-gradient(90deg, ${scoreColor}, #00f3ff)`,
                    borderRadius: '3px',
                    transition: 'width 1s ease-out',
                    boxShadow: `0 0 10px ${scoreColor}55`
                }} />
            </div>
        </div>
    );
};

export default QuizResult;
