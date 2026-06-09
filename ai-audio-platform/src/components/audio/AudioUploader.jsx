import React, { useState } from 'react';
import { uploadAudio } from '../../services/audioService';
import Button from '../common/Button';

const AudioUploader = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file.");
            return;
        }

        setUploading(true);
        try {
            const result = await uploadAudio(file);
            onUploadComplete(result);
        } catch (err) {
            setError("Upload failed. Please try again.");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="audio-uploader" style={{ border: '2px dashed var(--surface-color)', padding: '2rem', borderRadius: 'var(--border-radius)' }}>
            <input type="file" onChange={handleFileChange} accept="audio/*,video/*" />
            <div style={{ marginTop: '1rem' }}>
                <Button onClick={handleUpload} disabled={uploading || !file}>
                    {uploading ? 'Uploading...' : 'Upload Media (Audio/Video)'}
                </Button>
            </div>
            {error && <p style={{ color: 'var(--error-color)', marginTop: '0.5rem' }}>{error}</p>}
        </div>
    );
};

export default AudioUploader;
