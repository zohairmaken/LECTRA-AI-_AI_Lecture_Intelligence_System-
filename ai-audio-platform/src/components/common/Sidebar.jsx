import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    FiGrid, FiUpload, FiBook, FiActivity, FiSettings, 
    FiLogOut, FiCpu, FiMessageSquare, FiTrendingUp 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'OVERVIEW', icon: FiGrid, path: '/dashboard' },
        { id: 'upload', label: 'UPLOAD STUDIO', icon: FiUpload, path: '/upload' },
        { id: 'library', label: 'LECTURE LIBRARY', icon: FiBook, path: '/library' },
        { id: 'hub', label: 'LEARNING HUB', icon: FiActivity, path: '/learning-hub' },
    ];

    const bottomItems = [
        { id: 'settings', label: 'CONFIG', icon: FiSettings, path: '/settings' },
    ];

    const isActive = (path) => location.pathname === path;

    const itemStyle = (active) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.85rem 1.25rem',
        margin: '0.2rem 0.75rem',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        background: active ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
        border: active ? '1px solid rgba(79, 70, 229, 0.15)' : '1px solid transparent',
        fontSize: '0.85rem',
        fontWeight: '600',
        whiteSpace: 'nowrap',
    });

    return (
        <div style={{
            width: '280px',
            height: '100vh',
            background: 'var(--background-color)',
            borderRight: '1px solid var(--surface-border)',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 100,
            transition: 'background-color 0.3s ease'
        }}>
            {/* Logo Section */}
            <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                    width: '32px', height: '32px', background: 'var(--accent-primary)', 
                    borderRadius: '8px', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', color: '#fff', fontWeight: '800' 
                }}>L</div>
                <span style={{ fontWeight: '800', letterSpacing: '1px', fontSize: '1.25rem' }}>LECTRA</span>
            </div>

            {/* User Profile Hook */}
            <div style={{ padding: '0 1.5rem 2rem' }}>
                <div style={{ 
                    padding: '0.85rem', background: 'var(--surface-card)', 
                    borderRadius: '14px', border: '1px solid var(--surface-border)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--surface-panel)', borderRadius: '50%', border: '1px solid var(--surface-border)' }} />
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.username || 'User'}</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.5 }}>Student Account</p>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav style={{ flex: 1 }}>
                <p style={{ padding: '0 1.75rem', fontSize: '0.7rem', opacity: 0.4, fontWeight: '700', letterSpacing: '1px', marginBottom: '0.75rem' }}>MAIN MENU</p>
                {menuItems.map(item => (
                    <div 
                        key={item.id} 
                        style={itemStyle(isActive(item.path))}
                        onClick={() => navigate(item.path)}
                        onMouseEnter={(e) => { if(!isActive(item.path)) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                        onMouseLeave={(e) => { if(!isActive(item.path)) e.currentTarget.style.background = 'transparent'; }}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </div>
                ))}

                <p style={{ padding: '1.5rem 1.75rem 0.75rem', fontSize: '0.7rem', opacity: 0.4, fontWeight: '700', letterSpacing: '1px' }}>STUDENT TOOLS</p>
                {bottomItems.map(item => (
                    <div 
                        key={item.id} 
                        style={itemStyle(isActive(item.path))}
                        onClick={() => navigate(item.path)}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </div>
                ))}
            </nav>

            {/* Logout Section */}
            <div style={{ padding: '2rem' }}>
                <button 
                    onClick={logout}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'transparent',
                        border: '1px solid var(--surface-border)',
                        borderRadius: '10px',
                        color: 'var(--error-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(244, 63, 94, 0.05)';
                        e.currentTarget.style.borderColor = 'var(--error-color)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'var(--surface-border)';
                    }}
                >
                    <FiLogOut size={16} /> Log Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
