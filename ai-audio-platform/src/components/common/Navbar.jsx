import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const navItems = [
        { label: 'Services', href: '/services' },
        { label: 'How It Works', href: '/how-to-use' },
        { label: 'About', href: '/about' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Learning Hub', href: '/learning-hub' },
    ];

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 3rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'var(--glass-blur)',
        backgroundColor: 'var(--nav-bg)',
        borderBottom: '1px solid var(--nav-border)',
        boxShadow: 'var(--box-shadow-glow)',
        transition: 'all 0.3s ease'
    };

    return (
        <nav style={navStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '35px',
                        height: '35px',
                        background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.2))',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(255,255,255,0.5)'
                    }}>
                        <span style={{ color: '#000', fontWeight: 'bold', fontSize: '0.8rem' }}>L-AI</span>
                    </div>
                    <span style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        fontFamily: 'var(--font-family-display)',
                        letterSpacing: '3px',
                        color: 'var(--text-primary)',
                        textShadow: '0 0 10px var(--nav-border)'
                    }}>
                        LECTRA-AI
                    </span>
                </Link>
            </div>

            <div className="desktop-nav">
                <ul className="nav-list" style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '2rem' }}>
                    {(navItems || []).map((item) => (
                        <li key={item?.href || Math.random()} className="nav-item">
                            <Link
                                to={item?.href || '#'}
                                className={`nav-link ${location.pathname === item?.href ? 'active' : ''}`}
                                style={{
                                    textDecoration: 'none',
                                    color: location.pathname === item?.href ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                {item?.label || 'LINK'}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="utility-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Theme Toggle Button - Repositioned for professional look */}
                <button
                    onClick={toggleTheme}
                    className="theme-toggle-btn"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    style={{
                        background: 'var(--surface-card)',
                        border: '1px solid var(--surface-border)',
                        cursor: 'pointer',
                        padding: '0.6rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-primary)',
                        transition: 'all 0.3s ease',
                        boxShadow: 'var(--box-shadow-glow)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                        e.currentTarget.style.transform = 'rotate(15deg)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--surface-border)';
                        e.currentTarget.style.transform = 'rotate(0deg)';
                    }}
                >
                    {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>

                <div className="auth-action">
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--error-color)',
                                cursor: 'pointer',
                                padding: '0.4rem 1.2rem',
                                borderRadius: '4px',
                                color: 'var(--error-color)',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                letterSpacing: '1px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--error-color)';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--error-color)';
                            }}
                        >
                            LOGOUT
                        </button>
                    ) : (
                        <Link to="/auth" style={{ textDecoration: 'none' }}>
                            <button className="login-btn" style={{
                                background: 'var(--accent-primary)',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.4rem 1.2rem',
                                borderRadius: '4px',
                                color: '#fff',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                letterSpacing: '1px'
                            }}>
                                LOGIN
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ display: 'none' }}>
                <span style={{ fontSize: '1.5rem', color: '#fff' }}>☰</span>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .desktop-nav {
                        display: none;
                    }
                    .mobile-menu-toggle {
                        display: block !important;
                        cursor: pointer;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
