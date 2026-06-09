import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/common/MainLayout';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

// Lazy load pages for performance
const WelcomePage = lazy(() => import('../pages/WelcomePage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const UploadPage = lazy(() => import('../pages/UploadPage'));
const TranscriptPage = lazy(() => import('../pages/TranscriptPage'));
const LearningHub = lazy(() => import('../pages/LearningHub'));
const QuizPage = lazy(() => import('../pages/QuizPage'));
const QuizLibrary = lazy(() => import('../pages/QuizLibrary'));
const LibraryPage = lazy(() => import('../pages/LibraryPage'));
const EvaluationPage = lazy(() => import('../pages/EvaluationPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ServicesPage = lazy(() => import('../pages/ServicesPage'));
const HowToUsePage = lazy(() => import('../pages/HowToUsePage'));
const PricingPage = lazy(() => import('../pages/PricingPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    // Add a fast-path check for token in localStorage to avoid race conditions during login redirects
    const hasToken = !!localStorage.getItem('token');
    
    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-color)' }}>
            <Loader label="VERIFYING_CREDENTIALS" />
        </div>
    );
    
    const isActuallyAuthenticated = isAuthenticated || hasToken;
    
    if (!isActuallyAuthenticated) {
        console.warn("[Lectra-AI] Unauthorized access attempt, redirecting to /auth");
        return <Navigate to="/auth" />;
    }
    
    return children;
};

const AppRoutes = () => {
    return (
        <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-color)' }}>
                <Loader label="LOADING_MODULES" />
            </div>
        }>
            <Routes>
                {/* Public Pages - No Sidebar */}
                <Route path="/" element={<MainLayout useSidebar={false}><WelcomePage /></MainLayout>} />
                <Route path="/auth" element={<MainLayout useSidebar={false}><AuthPage /></MainLayout>} />
                <Route path="/services" element={<MainLayout useSidebar={false}><ServicesPage /></MainLayout>} />
                <Route path="/about" element={<MainLayout useSidebar={false}><AboutPage /></MainLayout>} />
                <Route path="/how-to-use" element={<MainLayout useSidebar={false}><HowToUsePage /></MainLayout>} />
                <Route path="/pricing" element={<MainLayout useSidebar={false}><PricingPage /></MainLayout>} />

                {/* Protected Pages - With Sidebar */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <MainLayout useSidebar={true}><Dashboard /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/upload" element={
                    <ProtectedRoute>
                        <MainLayout useSidebar={true}><UploadPage /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/transcript/:id" element={
                    <ProtectedRoute>
                        <MainLayout useSidebar={true}><TranscriptPage /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/library" element={
                    <ProtectedRoute>
                        <MainLayout useSidebar={true}><LibraryPage /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/hub" element={
                    <ProtectedRoute>
                        <MainLayout useSidebar={true}><LearningHub /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/learning-hub" element={
                    <ProtectedRoute>
                        <MainLayout useSidebar={true}><LearningHub /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/quiz/:id" element={
                    <ProtectedRoute>
                        <MainLayout useSidebar={true}><QuizPage /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/quiz-library" element={
                    <ProtectedRoute>
                        <MainLayout useSidebar={true}><QuizLibrary /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/evaluation" element={
                    <ProtectedRoute>
                        <MainLayout useSidebar={true}><EvaluationPage /></MainLayout>
                    </ProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<MainLayout useSidebar={false}><NotFound /></MainLayout>} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
