import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
    FiUploadCloud, FiFile, FiHeadphones, FiZap, 
    FiArrowRight, FiInfo, FiShield, FiCpu, FiPlus, FiX 
} from 'react-icons/fi';
import { lectures } from '../services/api';
import ProcessingPipeline from '../components/common/ProcessingPipeline';

const AUDIO_BASE = 'http://localhost:8000/sub/uploads';

const UploadPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lectureId, setLectureId] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('Queued');
    const [lectureData, setLectureData] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [fileDuration, setFileDuration] = useState(null);

    const processFile = (file) => {
        if (!file) return;
        setSelectedFile(file);
        setUploadError(null);
        if (file.type.startsWith('audio') || file.type.startsWith('video') || file.name.match(/\.(mp3|wav|mp4|mkv)$/i)) {
            const objectUrl = URL.createObjectURL(file);
            const media = new Audio(objectUrl);
            media.onloadedmetadata = () => {
                setFileDuration(media.duration);
                URL.revokeObjectURL(objectUrl);
            };
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleUploadClick = async () => {
        if (!selectedFile) return;
        setIsProcessing(true);
        setUploadError(null);
        setCurrentStatus('Queued');

        try {
            const response = await lectures.upload(selectedFile);
            setLectureId(response.data.id);
        } catch (error) {
            setUploadError(error.response?.data?.detail || 'FAILED TO ESTABLISH CONNECTION TO SERVER');
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (!lectureId || !isProcessing) return;
        const poll = async () => {
            try {
                const res = await lectures.getStatus(lectureId);
                const data = res.data;
                setCurrentStatus(data.status);
                setLectureData(data);
                if (data.status === 'Completed' || data.status === 'Failed') {
                    setIsProcessing(false);
                }
            } catch (err) {
                console.error('Status poll failed:', err);
            }
        };
        const interval = setInterval(poll, 2000);
        return () => clearInterval(interval);
    }, [lectureId, isProcessing]);

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div style={{ padding: '4rem 2rem 10rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <div style={{ display: 'inline-flex', padding: '0.4rem 1.25rem', background: 'rgba(79, 70, 229, 0.08)', borderRadius: '100px', border: '1px solid rgba(79, 70, 229, 0.2)', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px', marginBottom: '2rem' }}>
                    <FiCpu style={{ marginRight: '0.5rem' }} /> UPLOAD STUDIO
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>Create <span style={{ color: 'var(--accent-primary)' }}>Upload</span></h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.5, marginTop: '1rem', fontWeight: '500', maxWidth: '600px', marginInline: 'auto', lineHeight: '1.6' }}>
                    Upload your recordings to the Lectra-AI platform for high-quality transcription and automated study analysis.
                </p>
            </header>

            <AnimatePresence mode="wait">
                {isProcessing || currentStatus === 'Completed' || currentStatus === 'Failed' ? (
                    <motion.div key="processing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <ProcessingPipeline currentStatus={currentStatus} />
                        
                        {currentStatus === 'Completed' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '6rem', background: 'var(--surface-card)', padding: '5rem', borderRadius: '40px', border: '1px solid var(--surface-border)', textAlign: 'center' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--success-color)11', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3rem', border: '1px solid var(--success-color)33', color: 'var(--success-color)' }}>
                                    <FiZap size={32} />
                                </div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>UPLOAD COMPLETE</h2>
                                <p style={{ opacity: 0.5, marginBottom: '4rem', fontSize: '1.1rem' }}>Your recording has been successfully processed.</p>
                                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                                    <button onClick={() => navigate(`/transcript/${lectureId}`)} style={{ padding: '1.25rem 4rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '16px', color: '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: 'var(--box-shadow-glow)' }}>VIEW LECTURE</button>
                                    <button onClick={() => { setLectureId(null); setSelectedFile(null); setCurrentStatus('Queued'); }} style={{ padding: '1.25rem 4rem', background: 'transparent', border: '1px solid var(--surface-border)', borderRadius: '16px', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer' }}>UPLOAD ANOTHER</button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div 
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); }}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                background: 'var(--surface-card)', border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--surface-border)'}`, borderRadius: '40px', padding: '8rem 4rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: isDragging ? 'var(--accent-primary)08' : 'transparent', pointerEvents: 'none' }} />
                            
                            <motion.div animate={{ y: isDragging ? -10 : 0 }}>
                                <div style={{ width: '100px', height: '100px', background: 'var(--background-color)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3rem', border: '1px solid var(--surface-border)', color: isDragging ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                                    <FiUploadCloud size={40} />
                                </div>
                                {selectedFile ? (
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{selectedFile.name}</h3>
                                        <p style={{ opacity: 0.5, letterSpacing: '1px', fontWeight: '600', fontSize: '0.85rem' }}>{formatSize(selectedFile.size)} • READY TO UPLOAD</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{isDragging ? 'Drop file here' : 'Choose file to upload'}</h3>
                                        <p style={{ opacity: 0.4, letterSpacing: '0.5px', lineHeight: '1.6' }}>Drag and drop recordings or click to browse files.<br/>Maximum size: 100MB • Supported: MP3, WAV, MP4</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={handleUploadClick}
                                disabled={!selectedFile}
                                style={{
                                    padding: '1.25rem 6rem', background: selectedFile ? 'var(--accent-primary)' : 'var(--surface-border)', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '1.1rem', fontWeight: '700', cursor: selectedFile ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease', boxShadow: selectedFile ? 'var(--box-shadow-glow)' : 'none'
                                }}
                            >
                                {selectedFile ? 'Process Recording' : 'No File Selected'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer style={{ marginTop: '10rem', borderTop: '1px solid var(--surface-border)', paddingTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', opacity: 0.6 }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <FiShield size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Secure Processing</h4>
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>Records are processed entirely within a secure hardware environment ensuring maximum data privacy.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <FiZap size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Speaker Identification</h4>
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>Automatic teacher and student separation using advanced AI diarization architecture.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <FiInfo size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>High Fidelity</h4>
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>Professional-grade noise reduction and spectral normalization applied to every audio stream.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UploadPage;
