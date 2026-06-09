import { useState, useEffect } from 'react';
import { getTranscript } from '../services/transcriptService';

const useTranscript = (audioId) => {
    const [transcript, setTranscript] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!audioId) return;

        let interval;
        const fetchTranscript = async () => {
            try {
                const data = await getTranscript(audioId);
                setTranscript(data);
                
                // Stop polling if complete or failed
                if (data.status === 'Completed' || data.status.startsWith('Failed')) {
                    clearInterval(interval);
                    setLoading(false);
                }
            } catch (err) {
                setError(err);
                clearInterval(interval);
                setLoading(false);
            }
        };

        setLoading(true);
        fetchTranscript(); // Initial fetch
        
        // Start polling
        interval = setInterval(fetchTranscript, 2000);

        return () => clearInterval(interval);
    }, [audioId]);

    return { transcript, loading, error, setTranscript };
};

export default useTranscript;
