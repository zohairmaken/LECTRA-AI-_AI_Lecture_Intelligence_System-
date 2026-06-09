import os
import sys
import numpy as np
from pydub import AudioSegment

# Create noisy test audio (10 seconds)
sample_rate = 16000
duration = 10 
t = np.linspace(0, duration, int(sample_rate * duration))
# sine wave 440hz
signal = 0.5 * np.sin(2 * np.pi * 440 * t)
# white noise
noise = 0.5 * np.random.normal(0, 1, len(t))
noisy_signal = signal + noise

# convert to int16
noisy_signal_int16 = np.int16(noisy_signal * 32767)

# save with pydub
from pydub import AudioSegment
audio = AudioSegment(
    noisy_signal_int16.tobytes(), 
    frame_rate=sample_rate,
    sample_width=2, 
    channels=1
)
audio.export("test_noisy.wav", format="wav")

print("Created test_noisy.wav")

from app.services.audio_service import audio_service

try:
    print(f"Original RMS: {audio.rms}")
    output = audio_service._run_deepfilternet("test_noisy.wav")
    print(f"DFN Returned path: {output}")
    
    cleaned = AudioSegment.from_file(output)
    print(f"Cleaned RMS: {cleaned.rms}")
except Exception as e:
    print(f"FAILED: {e}")
