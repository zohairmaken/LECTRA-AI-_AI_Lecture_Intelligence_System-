import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check localStorage for saved theme, default to 'dark'
    const [theme, setThemeState] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    // Function to set theme and persist to localStorage
    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Toggle helper
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Apply theme attribute to html element and sync transition effect
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Dynamic body background color sync (extra safety for overscrolling)
        const bg = theme === 'dark' ? '#0f172a' : '#f8fafc';
        document.body.style.backgroundColor = bg;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
