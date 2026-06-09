import React from 'react';
import QuizStack from '../components/student/QuizStack';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiDatabase } from 'react-icons/fi';

const QuizLibrary = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background-color)', color: 'var(--text-primary)' }}>
            

            <main className="quiz-library-page animate-fade-in" style={{
                padding: '8rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '1rem', 
                        marginBottom: '1.5rem',
                        color: 'var(--accent-primary)'
                    }}>
                        <FiDatabase size={24} />
                        <span style={{ fontSize: '0.85rem', letterSpacing: '2px', fontWeight: '700' }}>PLATFORM_ONLINE</span>
                    </div>
                    
                    <h1 style={{ 
                        fontSize: '3rem', 
                        fontWeight: '800', 
                        marginBottom: '1rem',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em'
                    }}>
                        LECTURE QUIZZES
                    </h1>
                    
                    <p style={{ 
                        color: 'var(--text-muted)', 
                        fontSize: '1.1rem',
                        maxWidth: '600px', 
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Select an active module from your library to begin your 
                        knowledge assessment and track your learning progress.
                    </p>
                </header>

                <div style={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center',
                    background: 'var(--surface-card)',
                    padding: '4rem 2rem',
                    borderRadius: '32px',
                    border: '1px solid var(--surface-border)',
                    boxShadow: 'var(--box-shadow-glow)'
                }}>
                    <QuizStack />
                </div>
                
                <footer style={{ marginTop: '5rem', textAlign: 'center', opacity: 0.4, fontSize: '0.8rem', letterSpacing: '2px' }}>
                    LECTRA-AI // SECURE_PLATFORM
                </footer>
            </main>
        </div>
    );
};

export default QuizLibrary;
