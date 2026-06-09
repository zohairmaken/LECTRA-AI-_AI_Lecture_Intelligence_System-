import React, { createContext, useState, useMemo } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const value = useMemo(() => ({
        currentAudio,
        setCurrentAudio,
        isPlaying,
        setIsPlaying
    }), [currentAudio, isPlaying]);

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};
