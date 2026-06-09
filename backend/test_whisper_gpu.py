try:
    from faster_whisper import WhisperModel
    import torch
    print(f"Torch CUDA: {torch.cuda.is_available()}")
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Attempting to load Whisper on {device}...")
    
    model = WhisperModel("tiny", device=device, compute_type="float16" if device == "cuda" else "int8")
    print("✅ Whisper loaded successfully!")
except Exception as e:
    print(f"❌ Whisper load failed: {e}")
    import traceback
    traceback.print_exc()
