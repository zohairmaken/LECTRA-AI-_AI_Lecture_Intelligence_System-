import os
from app.services.audio_service import audio_service

try:
    print("Testing spectral gating with non-stationary mode...")
    out = audio_service._run_spectral_gating("test_noisy.wav")
    print(f"Success! Output generated at: {out}")
except Exception as e:
    print(f"Failed: {e}")
