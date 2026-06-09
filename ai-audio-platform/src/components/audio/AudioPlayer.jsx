import React, { useRef, useEffect } from 'react';
import useAudio from '../../hooks/useAudio';

const AudioPlayer = ({ src }) => {
    const audioRef = useRef(null);
    const { setIsPlaying } = useAudio();

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [setIsPlaying]);

    return (
        <div className="audio-player glass-panel" style={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderLeft: '4px solid #fff',
            boxShadow: '-10px 0 20px rgba(255,255,255,0.05)'
        }}>
            <span style={{ fontSize: '0.7rem', color: '#fff', letterSpacing: '2px', opacity: 0.7 }}>// DATA_STREAM_ACTIVE</span>
            <audio
                ref={audioRef}
                controls
                src={src}
                style={{
                    width: '100%',
                    height: '40px',
                    outline: 'none',
                    filter: 'invert(1) brightness(2) contrast(1.2)', // Make it pop as pure white/silver
                }}
            >
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

export default AudioPlayer;
