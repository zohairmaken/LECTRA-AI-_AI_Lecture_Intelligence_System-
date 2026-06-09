import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { auth as authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start true — checking token on mount

    // On mount, try to restore session from stored token
    useEffect(() => {
        const restoreSession = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                // Set aggressive 5s timeout for initial check to avoid boot-up hangs
                const response = await authService.getMe({ timeout: 5000 });
                setUser(response.data);
                console.log("[Lectra-AI] Session restored for:", response.data.email);
            } catch (err) {
                console.warn("[Lectra-AI] Token invalid or expired, clearing session.");
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = useCallback((userData, token) => {
        if (token) {
            localStorage.setItem('token', token);
        }
        setUser(userData);
        setLoading(false); // Explicitly clear loading state on successful login
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
    }, []);

    const isAuthenticated = !!user;

    const value = useMemo(() => ({
        user,
        isAuthenticated,
        loading,
        login,
        logout
    }), [user, isAuthenticated, loading, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
