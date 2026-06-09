# LECTRA-AI: Intelligent Lecture Analysis Platform

## Overview
LECTRA-AI is a full-stack platform that transforms lecture recordings (Audio/Video) into interactive knowledge bases. It uses advanced AI to generate transcripts, summaries, quizzes, and a chat interface.

## Key Features
- **Smart Upload**: Accepts **Audio (.mp3, .wav)** and **Video (.mp4, .mkv)** files.
- **Noise Removal**: Automatically cleans background noise using **Demucs**.
- **Speaker Diarization**: Identifies who is speaking using **Pyannote.audio**.
- **Transcription**: High-accuracy speech-to-text using **Faster-Whisper**.
- **Assessment**: Auto-generates Quizzes and Study Plans.
- **RAG Chat**: Chat with your lecture content using vector search.

## 🚀 Setup Guide

### Prerequisites
1.  **Python 3.10+**: [Download Here](https://www.python.org/downloads/)
    *   **IMPORTANT**: Check "Add Python to PATH" during installation.
2.  **Node.js (for Frontend)**: [Download Here](https://nodejs.org/)
3.  **FFmpeg**: Required for audio processing.
    *   Windows: `winget install ffmpeg` or download binaries and add to PATH.

### Installation

#### 1. Backend Setup
The backend handles all AI processing.
```bash
cd backend
# Create virtual environment (Recommended)
python -m venv venv
.\venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt
```
*Note: Installing `torch` and `demucs` may take a few minutes.*

#### 2. Frontend Setup
The user interface.
```bash
# In the root folder (ai-audio-platform)
npm install
npm run dev
```

### Running the App
We have provided a helper script for Windows:
1.  Double-click `run_backend.bat` to start the Python server.
2.  The frontend is accessible at `http://localhost:5173`.

## Environment Variables (.env)
Create a `.env` file in `backend/` with your keys:
```env
OPENAI_API_KEY=sk-...
HF_TOKEN=hf_... (For Speaker Diarization)
DATABASE_URL=sqlite:///./lectra.db (Default)
```
