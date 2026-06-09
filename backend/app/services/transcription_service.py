import time
import os

class TranscriptionService:
    def __init__(self):
        self.model = None
        import os
        self.device = "cuda" if os.getenv("FORCE_CPU") != "1" else "cpu"
        self.compute_type = "float16" if self.device == "cuda" else "int8"
        self._initialized = False

    def _initialize(self):
        if self._initialized:
            return
        
        import torch
        from faster_whisper import WhisperModel
        if torch.cuda.is_available() and self.device == "cuda":
            self.device = "cuda"
            self.compute_type = "float16"
        else:
            self.device = "cpu"
            self.compute_type = "int8"
            
        print(f"[WHISPER] Loading 'medium' on {self.device} with {self.compute_type}...")
        
        try:
            self.model = WhisperModel(
                "medium", 
                device=self.device, 
                compute_type=self.compute_type
            )
            print(f"[WHISPER] Model loaded successfully on {self.device}.")
        except Exception as e:
            print(f"[WHISPER FAILURE] Could not load model: {e}")
            raise e

        self._initialized = True

    def transcribe(self, file_path: str):
        """
        Transcribes the audio file and returns segments with timestamps.
        """
        self._initialize()
        print(f"\n[WHISPER START] Transcribing {file_path} on CPU...")
        start_time = time.time()
        
        try:
            segments, info = self.model.transcribe(
                file_path, 
                beam_size=5,
                language="en", # Defaulting to English for stability
                vad_filter=True # Use Whisper's built-in VAD
            )
            
            result = []
            for segment in segments:
                result.append({
                    "start": segment.start,
                    "end": segment.end,
                    "text": segment.text.strip()
                })

            end_time = time.time()
            print(f"[WHISPER END] Transcribed {len(result)} segments. Audio duration: {info.duration:.2f}s")
            print(f"[WHISPER END] Inference took {end_time - start_time:.2f}s")
            
            return result, info.duration
        except Exception as e:
            print(f"[WHISPER FAILURE] Error during transcription: {e}")
            import traceback
            traceback.print_exc()
            return [], 0

    def merge_diarization(self, transcript, diarization, teacher_speaker=None):
        """
        Merges transcript with speaker names using advanced overlap logic.
        Favors the speaker with the most overlap and handles slight timestamp offsets.
        """
        def get_speaker(t_segment, diar_segments):
            t_start, t_end = t_segment["start"], t_segment["end"]
            
            best_speaker = "Unknown"
            max_overlap = 0
            closest_speaker = "Unknown"
            min_dist = float('inf')

            for d in diar_segments:
                d_start, d_end = d["start"], d["end"]
                
                # Calculate overlap
                overlap_start = max(t_start, d_start)
                overlap_end = min(t_end, d_end)
                overlap = max(0, overlap_end - overlap_start)

                if overlap > max_overlap:
                    max_overlap = overlap
                    best_speaker = d["speaker"]
                
                # Track closest segment for fuzzy matching
                dist = 0
                if t_start > d_end:
                    dist = t_start - d_end
                elif d_start > t_end:
                    dist = d_start - t_end
                
                if dist < min_dist:
                    min_dist = dist
                    closest_speaker = d["speaker"]

            # Use max overlap if significant, otherwise try fuzzy match within 0.5s
            if max_overlap > 0:
                return best_speaker
            
            if min_dist < 0.5: # 500ms threshold for slight offsets
                return closest_speaker
                
            return "Unknown"

        final_output = []
        for text_seg in transcript:
            speaker = get_speaker(text_seg, diarization)
            
            # Map Speaker IDs to roles
            role = speaker
            if teacher_speaker and speaker == teacher_speaker:
                role = "Teacher"
            
            final_output.append({
                **text_seg,
                "speaker": role
            })
        
        # --- NEW: Gap-Filling Pass ---
        # If we have Speaker A -> Unknown -> Speaker A, it's almost certainly Speaker A
        if len(final_output) > 2:
            for i in range(1, len(final_output) - 1):
                if final_output[i]["speaker"] == "Unknown":
                    prev_s = final_output[i-1]["speaker"]
                    next_s = final_output[i+1]["speaker"]
                    if prev_s == next_s and prev_s != "Unknown":
                        final_output[i]["speaker"] = prev_s
                        
        # Second Pass: If start/end are Unknown, pull from nearest
        if len(final_output) > 1:
            if final_output[0]["speaker"] == "Unknown":
                final_output[0]["speaker"] = final_output[1]["speaker"]
            if final_output[-1]["speaker"] == "Unknown":
                final_output[-1]["speaker"] = final_output[-2]["speaker"]

        return final_output

transcription_service = TranscriptionService()
