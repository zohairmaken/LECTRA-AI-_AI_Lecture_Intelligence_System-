import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { auth } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiChevronRight } from 'react-icons/fi';

const AuthPage = () => {
    const { login: syncLogin } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [waitingForServer, setWaitingForServer] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setWaitingForServer(false);

        // Connection Shield: If the request takes > 3s, notify the user we are waiting on the engine
        const connectionTimer = setTimeout(() => {
            setWaitingForServer(true);
        }, 3000);

        try {
            if (isLogin) {
                const response = await auth.login(email, password);
                const token = response.data.access_token;
                localStorage.setItem('token', token);
                try {
                    const meResponse = await auth.getMe();
                    syncLogin(meResponse.data, token);
                } catch {
                    syncLogin({ email }, token);
                }
                navigate('/dashboard');
            } else {
                await auth.register(email, password, fullName);
                setIsLogin(true);
                setError('Registration successful! Please login.');
            }
        } catch (err) {
            console.error(err);
            if (!err.response) {
                if (err.code === 'ECONNABORTED') {
                    setError("REQUEST_TIMEOUT: The AI engine is taking too long to respond. Check if the server is under heavy load.");
                } else {
                    setError("SERVER_OFFLINE: Cannot establish link to backend. Ensure run.ps1 is active and Port 8000 is open.");
                }
            } else {
                const detail = err.response?.data?.detail || 'AUTHENTICATION_ERROR';
                setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
            }
        } finally {
            clearTimeout(connectionTimer);
            setLoading(false);
            setWaitingForServer(false);
        }
    };

    const inputStyle = {
        background: 'var(--surface-panel)',
        border: '1px solid var(--surface-border)',
        borderRadius: '8px',
        color: 'var(--text-primary)',
        padding: '0.9rem 1rem',
        outline: 'none',
        fontSize: '1rem',
        fontFamily: 'inherit',
        transition: 'all 0.3s ease',
        width: '100%'
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background-color)', color: 'var(--text-primary)' }}>

            <main className="flex-center animate-fade-in" style={{ 
                position: 'relative', 
                zIndex: 2, 
                padding: '10rem 2rem 4rem', 
                display: 'flex', 
                justifyContent: 'center' 
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '480px',
                    padding: '3.5rem',
                    background: 'var(--surface-card)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '24px',
                    boxShadow: 'var(--box-shadow-glow)'
                }}>
                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ 
                            marginBottom: '0.5rem', 
                            fontSize: '2.5rem', 
                            fontWeight: '800', 
                            letterSpacing: '-0.04em',
                            color: 'var(--text-primary)',
                        }}>LECTRA</h1>
                        <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', letterSpacing: '1px', fontWeight: '700' }}>
                            {isLogin ? 'ACCOUNT LOGIN' : 'CREATE ACCOUNT'}
                        </p>
                    </header>

                    {error && (
                        <div style={{
                            color: 'var(--error-color)',
                            padding: '1rem',
                            border: '1px solid var(--error-color)',
                            background: 'rgba(255, 42, 109, 0.05)',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {!isLogin && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FiUser size={14} /> FULL NAME
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--surface-border)'}
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FiMail size={14} /> EMAIL
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--surface-border)'}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FiLock size={14} /> PASSWORD
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--surface-border)'}
                            />
                        </div>

                        <Button type="submit" variant="primary" size="large" style={{ marginTop: '1.5rem', width: '100%', padding: '1.25rem', fontWeight: '700' }} disabled={loading}>
                            {loading ? 'PROCESSING...' : (isLogin ? 'SIGN IN' : 'REGISTER')}
                        </Button>

                        {waitingForServer && (
                            <p style={{ 
                                color: 'var(--accent-primary)', 
                                fontSize: '0.7rem', 
                                textAlign: 'center', 
                                marginTop: '1rem', 
                                letterSpacing: '1px',
                                animation: 'pulse 2s infinite'
                            }}>
                                Connecting to server...
                            </p>
                        )}
                    </form>

                    <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            {isLogin ? "New to the platform?" : "Already have an account?"}
                        </p>
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--surface-border)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                padding: '0.75rem 2.5rem',
                                borderRadius: '12px',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                e.currentTarget.style.color = 'var(--accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--surface-border)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                        >
                            {isLogin ? 'CREATE NEW ACCOUNT' : 'RETURN TO LOGIN'}
                        </button>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default AuthPage;
