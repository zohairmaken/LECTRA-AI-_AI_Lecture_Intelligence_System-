import time
from app.core.config import settings
from collections import Counter

class DiarizationService:
    def __init__(self):
        import os
        self.device = "cuda" if os.getenv("FORCE_CPU") != "1" else "cpu"
        self.token = settings.HF_TOKEN
        self.pipeline = None
        self._loaded = False

    def _load_pipeline(self):
        if not self.pipeline and self.token:
            from pyannote.audio import Pipeline
            
            import torch
            if torch.cuda.is_available() and self.device == "cuda":
                self.device = "cuda"
            else:
                self.device = "cpu"
                
            print(f"DiarizationService: Loading Pipeline on {self.device}...")
            try:
                self.pipeline = Pipeline.from_pretrained(
                    "pyannote/speaker-diarization-3.1",
                    use_auth_token=self.token
                ).to(torch.device(self.device))
                self._loaded = True
            except Exception as e:
                print(f"Diarization Load Error: {e}")
                self.pipeline = None

    def diarize(self, file_path: str, duration: float = None):
        """
        Returns list of segments: [{"start": 0.0, "end": 1.5, "speaker": "SPEAKER_00"}]
        """
        self._load_pipeline()
        
        if not self.pipeline:
            print("[DIARIZATION] WARNING: HF_TOKEN missing or pipeline load failed.")
            print(f"[DIARIZATION] Falling back to single-speaker mapping for {duration}s")
            return self._mock_diarization(duration)

        print(f"[DIARIZATION START] Processing {file_path} on {self.device}...")
        start_time = time.time()
        
        try:
            # Diarization models are VRAM heavy, clear cache before running
            import torch
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            # --- CRITICAL FIX: Actually run the pipeline! ---
            print(f"[DIARIZATION] Running inference on {file_path}...")
            diarization = self.pipeline(file_path)
            
            segments = []
            for turn, _, speaker in diarization.itertracks(yield_label=True):
                segments.append({
                    "start": turn.start,
                    "end": turn.end,
                    "speaker": speaker
                })
            
            end_time = time.time()
            print(f"[DIARIZATION END] Detected {len(segments)} segments and {len(set(s['speaker'] for s in segments))} speakers.")
            print(f"[DIARIZATION END] Took {end_time - start_time:.2f}s")
            return segments
        except Exception as e:
            print(f"[DIARIZATION FAILURE] Error during diarization: {e}")
            import traceback
            traceback.print_exc()
            return []

    def identify_teacher(self, segments):
        """
        Heuristic: The speaker with the most total accumulated time is the teacher.
        """
        if not segments:
            return "Unknown"
            
        durations = Counter()
        for seg in segments:
            durations[seg['speaker']] += (seg['end'] - seg['start'])
            
        if not durations:
            return "Unknown"
            
        return durations.most_common(1)[0][0]

    def _mock_diarization(self, duration: float = None):
        """Returns a dummy segment covering the file to prevent 'Unknown' labels."""
        end_time = duration if duration else 300 # Default 5 mins if unknown
        return [
            {"start": 0.0, "end": end_time, "speaker": "SPEAKER_00"}
        ]

diarization_service = DiarizationService()