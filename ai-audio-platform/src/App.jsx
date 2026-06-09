import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';

function App() {
    const { loading } = useAuth();

    // Show a loading screen while AuthContext validates the stored token
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
            }}>
                <Loader label="INITIALIZING_SYSTEM" />
            </div>
        );
    }

    return (
        <div className="App">
            <AppRoutes />
        </div>
    );
}

export default App;
