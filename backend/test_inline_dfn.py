import sys
import numpy as np
from pydub import AudioSegment
import torch

try:
    from df.enhance import enhance, init_df, load_audio, save_audio
    print("Successfully imported df.enhance")
except Exception as e:
    print(f"Failed to import DFN: {e}")
    sys.exit(1)

# Create test audio
sample_rate = 16000
duration = 5 
t = np.linspace(0, duration, int(sample_rate * duration))
signal = 0.5 * np.sin(2 * np.pi * 440 * t) + 0.5 * np.random.normal(0, 1, len(t))
noisy_signal_int16 = np.int16(signal * 32767)

audio = AudioSegment(
    noisy_signal_int16.tobytes(), 
    frame_rate=sample_rate,
    sample_width=2, 
    channels=1
)
audio.export("test_inline.wav", format="wav")
print(f"Original RMS inline: {audio.rms}")

try:
    model, df_state, _ = init_df()
    print("DFN Initialized")
    
    audio_df, sr = load_audio("test_inline.wav", sr=df_state.sr())
    enhanced = enhance(model, df_state, audio_df, atten_lim_db=100)
    save_audio("test_inline_out.wav", enhanced, sr)
    
    cleaned = AudioSegment.from_file("test_inline_out.wav")
    print(f"Cleaned RMS inline: {cleaned.rms}")
except Exception as e:
    print(f"Inline DFN failed: {e}")
