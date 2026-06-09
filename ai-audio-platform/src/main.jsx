import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { AudioProvider } from './context/AudioContext'
import { QuizProvider } from './context/QuizContext'
import { ThemeProvider } from './context/ThemeContext'
import './styles/global.css'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#1a1a1a',
                    color: '#ff4444',
                    padding: '2rem',
                    zIndex: 9999,
                    overflow: 'auto',
                    fontFamily: 'monospace'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>CRITICAL SYSTEM FAILURE</h1>
                    <div style={{ background: '#000', padding: '1rem', borderRadius: '4px', border: '1px solid #333' }}>
                        <h2 style={{ fontSize: '1.2rem', color: '#fff' }}>Error Details:</h2>
                        <pre style={{ whiteSpace: 'pre-wrap', color: '#ff6b6b' }}>
                            {this.state.error && this.state.error.toString()}
                        </pre>
                    </div>
                    <div style={{ marginTop: '1rem', background: '#000', padding: '1rem', borderRadius: '4px', border: '1px solid #333' }}>
                        <h2 style={{ fontSize: '1.2rem', color: '#fff' }}>Component Stack:</h2>
                        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', color: '#888' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2rem',
                            padding: '1rem 2rem',
                            background: '#ff4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        REBOOT SYSTEM (RELOAD)
                    </button>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }}
                        style={{
                            marginTop: '2rem',
                            marginLeft: '1rem',
                            padding: '1rem 2rem',
                            background: '#444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        HARD RESET (CLEAR DATA)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Global error listener for non-React crashes
window.addEventListener('error', (event) => {
    console.error("[Lectra-AI-Critical] Unhandled Global Error:", event.error);
});

console.log("[Lectra-AI] System rendering initialization...");

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <BrowserRouter>
                    <AuthProvider>
                        <AudioProvider>
                            <QuizProvider>
                                <ThemeProvider>
                                    <App />
                                </ThemeProvider>
                            </QuizProvider>
                        </AudioProvider>
                    </AuthProvider>
                </BrowserRouter>
            </ErrorBoundary>
        </React.StrictMode>
    );
} catch (renderError) {
    console.error("[Lectra-AI-Critical] Render Initiation Failed:", renderError);
    document.body.innerHTML = `<div style="padding: 2rem; color: #ff2a6d; background: #000; height: 100vh;">
        <h1>SYSTEM_BOOT_FAILURE</h1>
        <pre>${renderError.toString()}</pre>
        <button onclick="window.location.reload()">RETRY_BOOT</button>
    </div>`;
}
