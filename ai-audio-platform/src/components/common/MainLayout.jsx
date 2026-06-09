import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const MainLayout = ({ children, useSidebar = false }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Footer Component
    const Footer = () => (
        <footer style={{ 
            padding: '5rem 2rem', 
            background: 'var(--background-color)', 
            borderTop: '1px solid var(--surface-border)',
            textAlign: 'center'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '30px', height: '30px', background: 'var(--accent-primary)', borderRadius: '6px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>L</div>
                    <span style={{ fontWeight: '900', letterSpacing: '4px' }}>LECTRA-AI</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
                    <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy</a>
                    <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>Infrastructure</a>
                    <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>AI Ethics</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <a href="#" style={{ color: 'var(--text-primary)', opacity: 0.5 }}><FiGithub size={20} /></a>
                    <a href="#" style={{ color: 'var(--text-primary)', opacity: 0.5 }}><FiLinkedin size={20} /></a>
                    <a href="#" style={{ color: 'var(--text-primary)', opacity: 0.5 }}><FiMail size={20} /></a>
                </div>
                <p style={{ fontSize: '0.7rem', opacity: 0.3, letterSpacing: '2px' }}>
                    © 2024 LECTRA-AI SYSTEM. DESIGNED & ARCHITECTED BY ZOHAIR HASSNAIN MAKEN.
                </p>
            </div>
        </footer>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background-color)', color: 'var(--text-primary)' }}>
            {useSidebar && isAuthenticated && <Sidebar />}
            
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                minWidth: 0 // Prevent flex-children from growing too large
            }}>
                {!useSidebar && <Navbar />}
                
                <main style={{ flex: 1, position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
