import React from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import StarField from '../components/react-bits/StarField/StarField';

const LectureLayout = () => {
    const { id } = useParams();

    const tabs = [
        { label: 'Transcript', path: `/lecture/${id}/transcript` },
        { label: 'AI Explanations', path: `/lecture/${id}/explanations` },
        { label: 'RAG Chat', path: `/lecture/${id}/chat` },
        { label: 'Analytics', path: `/lecture/${id}/analytics` },
        { label: 'Study Plan', path: `/lecture/${id}/studyplan` },
    ];

    return (
        <>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
                <StarField speed={0.005} backgroundColor="black" starColor="#ffffff" />
            </div>
            <Navbar />

            <div className="lecture-layout animate-fade-in" style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>LECTURE INTELLIGENCE INTERFACE</h2>
                    <p style={{ color: 'var(--text-muted)' }}>// ID: {id} // STATUS: ANALYSIS_COMPLETE</p>
                </header>

                <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 250px)' }}>
                    {/* Sidebar / Tabs */}
                    <aside style={{
                        width: '250px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        flexShrink: 0
                    }}>
                        {tabs.map(tab => (
                            <NavLink
                                key={tab.path}
                                to={tab.path}
                                className={({ isActive }) => isActive ? 'active-tab' : 'inactive-tab'}
                                style={({ isActive }) => ({
                                    padding: '1rem 1.5rem',
                                    borderRadius: '8px',
                                    backgroundColor: isActive ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                    border: isActive ? '1px solid var(--primary-color)' : '1px solid transparent',
                                    color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                })}
                            >
                                {tab.label}
                                {isActive && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', boxShadow: '0 0 10px var(--primary-color)' }}></span>}
                            </NavLink>
                        ))}
                    </aside>

                    {/* Main Content Area */}
                    <main className="glass-panel" style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '2rem',
                        position: 'relative',
                        backgroundColor: 'rgba(5, 5, 10, 0.8)' /* Darker background for contrast */
                    }}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default LectureLayout;
