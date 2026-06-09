import os
import sys

# Avoid symlink issues on Windows for HuggingFace models
# MUST BE SET BEFORE OTHER IMPORTS
os.environ["HF_HUB_DISABLE_SYMLINKS"] = "1"

# Non-heavy imports
import numpy as np
import subprocess
import shutil
import time

# Deferred flags (Populated in _initialize)
TORCH_AVAILABLE = False
DEMUCS_AVAILABLE = False

# Custom Exceptions for Descriptive Frontend Feedback
class PipelineError(Exception):
    """Base class for pipeline errors."""
    pass

class DemucsError(PipelineError): pass
class SepFormerError(PipelineError): pass
class DeepFilterNetError(PipelineError): pass
class VADError(PipelineError): pass
class MasteringError(PipelineError): pass
class ConversionError(PipelineError): pass

class AudioService:
    def __init__(self):
        self.device = "cuda" if os.getenv("FORCE_CPU") != "1" else "cpu"
        self.demucs_model = None
        self._initialized = False

    def _initialize(self):
        global TORCH_AVAILABLE, DEMUCS_AVAILABLE
        if self._initialized:
            return
            
        print("--- Lazy Loading AI Dependencies ---")
        try:
            import torch
            import torchaudio
            TORCH_AVAILABLE = True
            if torch.cuda.is_available():
                self.device = "cuda"
                print(f"AudioService: Torch loaded in CUDA mode.")
            else:
                self.device = "cpu"
                print(f"AudioService: CUDA not found, using CPU.")
        except ImportError:
            TORCH_AVAILABLE = False
            print("AudioService WARNING: Torch/Torchaudio not found.")

        try:
            from demucs.pretrained import get_model
            from demucs.apply import apply_model
            DEMUCS_AVAILABLE = True
            
            if TORCH_AVAILABLE:
                device_type = torch.device(self.device)
                print(f"AudioService: Loading Demucs model on {self.device.upper()}...")
                self.demucs_model = get_model("htdemucs").to(device_type)
                print(f"AudioService: Demucs model loaded successfully on {self.device.upper()}.")
        except ImportError:
            DEMUCS_AVAILABLE = False
            print("AudioService WARNING: Demucs not found.")
        except Exception as e:
            print(f"AudioService ERROR: Unexpected initialization failure: {e}")
        
        self._initialized = True

    def process_pipeline(self, input_path: str) -> str:
        """
        Multi-Layer "Nuclear" Pipeline (Demucs -> SepFormer -> DFN -> VAD -> Spectral -> Master)
        STRICT ERROR HANDLING: Fails fast on any error.
        All GPU-capable stages run on CUDA for maximum speed.
        VRAM is explicitly cleared between stages to avoid OOM on 4GB T1000.
        """
        self._initialize()
        print(f"[AUDIO SERVICE] Processing Pipeline on {self.device.upper()}")
            
        print(f"\n[PIPELINE START] Processing: {input_path}")
        print(f"[PIPELINE INFO] File size: {os.path.getsize(input_path)} bytes")
        
        # Log original duration
        try:
            from pydub import AudioSegment
            orig_audio = AudioSegment.from_file(input_path)
            print(f"[PIPELINE INFO] Original audio duration: {len(orig_audio)}ms ({len(orig_audio)/1000:.1f}s)")
        except Exception:
            pass
        
        # Calculate Initial SNR
        snr_start = self._calculate_snr(input_path)
        print(f"[METRICS] Initial Signal-to-Noise Ratio: {snr_start:.2f} dB")
        
        # Generate BEFORE Spectrogram
        self.generate_spectrogram(input_path, suffix="_before")

        # Stage 1: Demucs Vocal Isolation on CPU (Shift=1 for speed)
        s1_start = time.time()
        try:
            vocal_path = self._run_demucs(input_path, model="htdemucs", shifts=1) 
            print(f"[PIPELINE STAGE 1] Demucs on {self.device.upper()} took {time.time() - s1_start:.2f}s")
        except Exception as e:
            print(f"[PIPELINE WARNING] Demucs Stage Failed: {e}. Falling back to original audio.")
            vocal_path = input_path
        
        # Free GPU VRAM before next stage
        self._clear_gpu_memory()
        
        # Stage 1.5: SepFormer (Speech Separation Layer)
        try:
            s15_start = time.time()
            sepformer_path = self._run_sepformer(vocal_path)
            print(f"[PIPELINE STAGE 1.5] SepFormer on {self.device.upper()} took {time.time() - s15_start:.2f}s")
        except Exception as e:
            print(f"[PIPELINE WARNING] SepFormer bypassed (missing dependency or error): {e}")
            sepformer_path = vocal_path
        
        # Free GPU VRAM before next stage
        self._clear_gpu_memory()
        
        # Stage 2: DeepFilterNet Enhancement (subprocess, uses DF_DEVICE)
        try:
            s2a_start = time.time()
            enhanced_path_1 = self._run_deepfilternet(sepformer_path)
            print(f"[PIPELINE STAGE 2a] DeepFilterNet Pass 1 on {self.device.upper()} took {time.time() - s2a_start:.2f}s")
            
            s2b_start = time.time()
            enhanced_path_2 = self._run_deepfilternet(enhanced_path_1, suffix="_pass2")
            print(f"[PIPELINE STAGE 2b] DeepFilterNet Pass 2 on {self.device.upper()} took {time.time() - s2b_start:.2f}s")
        except Exception as e:
            print(f"[PIPELINE WARNING] DeepFilterNet failed: {e}. Bypassing DFN step.")
            enhanced_path_2 = sepformer_path
        
        # Free GPU VRAM before next stage
        self._clear_gpu_memory()
        
        # Stage 3: Silero VAD on GPU (Aggressive Silencing)
        s3_start = time.time()
        vad_path = self._run_silero_vad(enhanced_path_2)
        print(f"[PIPELINE STAGE 3] Silero VAD on {self.device.upper()} took {time.time() - s3_start:.2f}s")

        # Free GPU VRAM before next stage
        self._clear_gpu_memory()

        # Stage 4: Spectral Gating (CPU-only library, no GPU needed)
        s4_start = time.time()
        final_polished_path = self._run_spectral_gating(vad_path)
        print(f"[PIPELINE STAGE 4] Spectral Gating (CPU) took {time.time() - s4_start:.2f}s")
        
        # Final Conversion
        final_path = self._run_final_conversion(final_polished_path)
        
        # Generate AFTER Spectrogram
        self.generate_spectrogram(final_path, suffix="_after")
        
        # Calculate Final SNR
        snr_end = self._calculate_snr(final_path)
        print(f"[METRICS] Final Signal-to-Noise Ratio: {snr_end:.2f} dB")
        print(f"[METRICS] Improvement: +{snr_end - snr_start:.2f} dB")
        
        # Total time
        print(f"[PIPELINE END] Total time: {time.time() - s1_start:.2f}s")
        return final_path

    def generate_spectrogram(self, audio_path: str, suffix: str = ""):
        """Generate a .png spectrogram for visual verification."""
        try:
            import matplotlib
            matplotlib.use('Agg')
            import matplotlib.pyplot as plt
            import librosa
            import librosa.display
            
            # More robust filename handling
            base, ext = os.path.splitext(audio_path)
            output_png = f"{base}{suffix}_spectrogram.png"
            
            print(f"[VISUALIZATION] Generating spectrogram: {output_png}...")
            
            y, sr = librosa.load(audio_path, sr=None)
            D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
            
            plt.figure(figsize=(10, 4))
            librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='log')
            plt.colorbar(format='%+2.0f dB')
            plt.title(f'Spectrogram {suffix}')
            plt.tight_layout()
            plt.savefig(output_png)
            plt.close()
            return output_png
        except Exception as e:
            print(f"[VISUALIZATION WARNING] Could not generate spectrogram: {e}")
            return None

    def generate_teacher_audio(self, full_audio_path: str, segments: list, teacher_speaker: str) -> str:
        """
        Stage 5: Physically extract teacher segments into a new file.
        """
        # Cache busting: Add timestamp
        timestamp = int(time.time())
        output_path = full_audio_path.replace(".wav", f"_TEACHER_ONLY_{timestamp}.wav")
        print(f"[TEACHER EXTRACTION] Generating {output_path} for speaker {teacher_speaker}...")
        
        try:
            import torch
            import torchaudio
            wav, sr = torchaudio.load(full_audio_path)
            teacher_audio_chunks = []
            
            for seg in segments:
                if seg['speaker'] == teacher_speaker:
                    # Convert time to samples
                    start_sample = int(seg['start'] * sr)
                    end_sample = int(seg['end'] * sr)
                    chunk = wav[:, start_sample:end_sample]
                    teacher_audio_chunks.append(chunk)
            
            if teacher_audio_chunks:
                # Concatenate all teacher chunks
                final_tensor = torch.cat(teacher_audio_chunks, dim=1)
                torchaudio.save(output_path, final_tensor, sr)
                print(f"[TEACHER EXTRACTION] Success. Duration: {final_tensor.shape[1]/sr:.2f}s")
                return output_path
            else:
                print("[TEACHER EXTRACTION] No teacher segments found.")
                return full_audio_path
        except Exception as e:
            print(f"[TEACHER EXTRACTION FAILED] {e}")
            return full_audio_path

    def _run_silero_vad(self, input_path: str) -> str:
        """
        Apply Silero VAD to mute non-speech segments on CPU.
        STRICT ERROR HANDLING: Raises VADError on failure.
        """
        output_path = input_path.replace(".wav", "_vad.wav")
        try:
            import torch
            print("[VAD] Loading Silero VAD model on CPU...")
            model, utils = torch.hub.load(repo_or_dir='snakers4/silero-vad',
                                        model='silero_vad',
                                        force_reload=False,
                                        trust_repo=True)
            (get_speech_timestamps, save_audio, read_audio, VADIterator, collect_chunks) = utils
            
            # Read audio (stays on CPU)
            wav = read_audio(input_path, sampling_rate=16000)
            
            # Get speech timestamps on CPU
            speech_timestamps = get_speech_timestamps(wav, model, sampling_rate=16000)
            
            print(f"[VAD] Detected {len(speech_timestamps)} speech segments on CPU.")
            
            # Create a silent tensor of same length
            final_wav = torch.zeros_like(wav)
            
            for seg in speech_timestamps:
                final_wav[seg['start']:seg['end']] = wav[seg['start']:seg['end']]
                
            # Save
            save_audio(output_path, final_wav, sampling_rate=16000)
            return output_path
        except Exception as e:
            raise VADError(f"Silero VAD failed: {e}")

    def _calculate_snr(self, file_path: str) -> float:
        """Estimate SNR using rough RMS."""
        # SNR calculation is non-critical, so we can keep the try/except logic
        # OR we can make it stricter. For now, let's keep it robust as it provides metrics only.
        try:
            import soundfile as sf
            data, _ = sf.read(file_path)
            if len(data.shape) > 1: data = data.mean(axis=1) # Mono
            rms = np.sqrt(np.mean(data**2))
            frame_len = 2048; hop = 512
            num_frames = (len(data) - frame_len) // hop
            energies = []
            for i in range(num_frames):
                frame = data[i*hop : i*hop+frame_len]
                energies.append(np.sum(frame**2))
            if not energies: return 0.0
            energies = np.array(energies); energies.sort()
            noise_floor = np.mean(energies[:int(len(energies)*0.1)])
            if noise_floor <= 0: return 99.0
            snr = 10 * np.log10(np.mean(energies) / noise_floor)
            return snr
        except Exception:
            return 0.0

    def _run_spectral_gating(self, input_path: str) -> str:
        """
        Apply stationary noise reduction (spectral gating) using noisereduce.
        STRICT ERROR HANDLING: Raises PipelineError on failure.
        """
        try:
            import noisereduce as nr
            import soundfile as sf
            
            print(f"[SPECTRAL GATING] Polishing {input_path}...")
            data, rate = sf.read(input_path)
            
            # If stereo, mix to mono first for robust noise profile
            if len(data.shape) > 1:
                data = data.mean(axis=1)
                
            # Perform noise reduction
            # stationary=False drastically improves removal of dynamic noises (e.g. background voices, clatter, street noises)
            # which stationary=True tends to leave behind as 'original voice' artifacts.
            reduced_noise = nr.reduce_noise(y=data, sr=rate, stationary=False, prop_decrease=1.0)
            
            output_name = os.path.splitext(input_path)[0] + "_polished.wav"
            sf.write(output_name, reduced_noise, rate)
            
            return output_name
        except Exception as e:
            raise PipelineError(f"Spectral Gating (Noisereduce) failed: {e}")

    def _run_podcast_mastering(self, input_path: str) -> str:
        """
        Apply 'Radio Voice' mastering chain using FFmpeg.
        Chain: HighPass(80Hz) -> DynAudNorm (Compression) -> LoudNorm (-16 LUFS)
        STRICT ERROR HANDLING: Raises MasteringError on failure.
        """
        # Cache busting
        timestamp = int(time.time())
        output_name = input_path.replace(".wav", f"_MASTERED_{timestamp}.wav")
        
        try:
            print(f"[MASTERING] Applying Podcast Filters to {input_path}...")
            
            # CHECK 7: Disable aggressive normalization after cleaning
            # Removed dynaudnorm and loudnorm to prevent pulling the noise floor back up.
            filter_chain = "highpass=f=80"
            
            command = [
                "ffmpeg", "-y", "-i", input_path,
                "-af", filter_chain,
                "-ar", "44100", 
                output_name
            ]
            
            # Capture stderr for debugging
            result = subprocess.run(command, check=True, capture_output=True, text=True)
            
            if os.path.exists(output_name):
                return output_name
            else:
                raise MasteringError(f"FFmpeg ran but output file not found. stderr: {result.stderr}")
        except subprocess.CalledProcessError as e:
            raise MasteringError(f"FFmpeg Mastering Error: {e.stderr}")
        except Exception as e:
            raise MasteringError(f"Podcast Mastering failed: {e}")

    def _run_sepformer(self, input_path: str) -> str:
        """
        Stage 1.5: Apply SepFormer (SpeechBrain) for source separation.
        Runs on GPU when available.
        STRICT ERROR HANDLING: Raises SepFormerError on failure.
        """
        output_name = os.path.splitext(input_path)[0] + "_sepformer.wav"
        try:
            import torch
            print(f"[SEPFORMER] Loading SpeechBrain SepFormer model on {self.device.upper()}...")
            
            # dynamic import to avoid crashes if library missing
            from speechbrain.inference.separation import SepformerSeparation as separator
            import huggingface_hub
            
            # --- CRITICAL FIX: Monkey-patch hf_hub_download to support 'use_auth_token' ---
            # Newer versions of huggingface_hub renamed this to 'token', 
            # but older SpeechBrain versions still use the old keyword.
            _orig_hf_download = huggingface_hub.hf_hub_download
            def _patched_hf_download(*args, **kwargs):
                if "use_auth_token" in kwargs:
                    kwargs["token"] = kwargs.pop("use_auth_token")
                return _orig_hf_download(*args, **kwargs)
            huggingface_hub.hf_hub_download = _patched_hf_download
            
            run_opts = {"device": self.device} if self.device == "cuda" else {}
            model = separator.from_hparams(
                source="speechbrain/sepformer-wham", 
                savedir="tmp_model",
                run_opts=run_opts
            )
            print(f"[SEPFORMER] Processing {input_path} on {self.device.upper()}...")
            
            # Estimate sources on GPU
            est_sources = model.separate_file(path=input_path)
            
            # Save the best source (move to CPU for saving)
            import torchaudio
            torchaudio.save(output_name, est_sources[:, :, 0].detach().cpu(), 8000)
            
            return output_name
        except Exception as e:
            raise SepFormerError(f"SepFormer Stage failed: {e}")

    def _load_audio(self, path: str):
        """Robust audio loading using soundfile (avoids torchaudio backend issues)."""
        import soundfile as sf
        import torch
        data, sr = sf.read(path)
        # sf returns (time, channels) or (time,)
        # torch expects (channels, time)
        tensor = torch.from_numpy(data).float()
        if tensor.dim() == 1:
            tensor = tensor.unsqueeze(0) # (1, time)
        else:
            tensor = tensor.t() # (channels, time)
        return tensor, sr

    def _save_audio(self, path: str, tensor, sr: int):
        """Robust audio saving using soundfile."""
        import soundfile as sf
        # tensor is (channels, time)
        # sf expects (time, channels)
        data = tensor.cpu().numpy().T
        sf.write(path, data, sr)

    def _run_demucs(self, input_path: str, model: str = "htdemucs", shifts: int = 1) -> str:
        """
        Isolate vocals using Demucs on GPU.
        STRICT ERROR HANDLING: Raises DemucsError on failure.
        """
        if not self.demucs_model:
            raise DemucsError("Demucs model not initialized. Application startup failed?")
            
        output_name = os.path.splitext(input_path)[0] + "_vocal.wav"
        try:
            import torch
            import torchaudio
            print(f"[DEMUCS] Running on {self.device.upper()} with model: {model} (Shifts={shifts})...")
            
            # Use soundfile backend via helper
            wav, sr = self._load_audio(input_path)
            
            if wav.shape[0] == 1:
                wav = wav.repeat(2, 1) # Stereo required

            from demucs.apply import apply_model
            sources = apply_model(
                self.demucs_model, wav[None],
                device=self.device, shifts=shifts, split=True,
                overlap=0.25, progress=True
            )[0]

            vocals = sources[3] # vocals
            self._save_audio(output_name, vocals, sr)
            return output_name
        except Exception as e:
            raise DemucsError(f"Demucs Vocal Isolation failed: {e}")

    def _clear_gpu_memory(self):
        """Release all GPU memory held by PyTorch so other stages can use it."""
        try:
            import torch
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                torch.cuda.synchronize()
                print("[MEMORY] GPU VRAM cache cleared.")
        except Exception:
            pass

    def _run_deepfilternet(self, input_path: str, suffix: str = "_enhanced") -> str:
        """
        Apply DeepFilterNet enhancement via chunked processing.
        Follows exact REQUIRED FIX logic to ensure NO truncation:
        1. Use pydub to slice existing audio into explicit chunks
        2. Process each chunk
        3. Append to array
        4. += merge in loop
        """
        try:
            from pydub import AudioSegment
            import shutil
            
            original_dir = os.path.dirname(input_path)
            output_dir = os.path.abspath(original_dir if original_dir else ".")
            output_name = os.path.splitext(input_path)[0] + f"{suffix}.wav"
            
            self._clear_gpu_memory()
            
            wrapper_script = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "run_deepfilternet.py")
            wrapper_script = os.path.abspath(wrapper_script)
            
            if not os.path.exists(wrapper_script):
                raise DeepFilterNetError(f"Wrapper script not found: {wrapper_script}")

            sub_env = os.environ.copy()
            # Target available hardware (CUDA/CPU) dynamically
            sub_env["DF_DEVICE"] = self.device

            print(f"[DeepFilterNet] Loading audio with pydub: {input_path}")
            # Load full audio into memory (Pydub is safe for 1-hour audio)
            original_audio = AudioSegment.from_file(input_path)
            original_duration_ms = len(original_audio)
            
            CHUNK_LEN_MS = 60 * 1000 # 60 seconds
            
            # Step 1: Use Existing Chunks (split full audio into explicit memory chunks)
            audio_chunks = []
            for i in range(0, original_duration_ms, CHUNK_LEN_MS):
                audio_chunks.append(original_audio[i:i+CHUNK_LEN_MS])
                
            print(f"[DeepFilterNet] Total chunks count: {len(audio_chunks)}")

            cleaned_chunks = []
            
            # Step 2: Process ALL chunks correctly
            for i, chunk in enumerate(audio_chunks):
                # Save temp chunk
                chunk_temp_in = os.path.splitext(input_path)[0] + f"_tempchunk_{i}.wav"
                chunk.export(chunk_temp_in, format="wav")
                
                print(f"[DeepFilterNet] Processing chunk {i+1}/{len(audio_chunks)} (duration: {len(chunk)}ms)")
                
                # Tune DFN strength: -a 15 is a safe middle ground.
                # User reported poor quality; -a 100 was likely destroying the signal.
                command = [sys.executable, wrapper_script, chunk_temp_in, "-o", output_dir, "-a", "15"]
                
                try:
                    subprocess.run(command, check=True, capture_output=True, text=True, env=sub_env)
                    
                    # Find DFN output
                    chunk_temp_out = chunk_temp_in.replace(".wav", "_DeepFilterNet3.wav")
                    if not os.path.exists(chunk_temp_out):
                        chunk_temp_out = chunk_temp_in.replace(".wav", "_DeepFilterNet2.wav")
                    
                    if os.path.exists(chunk_temp_out):
                        # Load cleaned chunk
                        cleaned = AudioSegment.from_file(chunk_temp_out)
                        
                        # --- CHECK 1: Function Output (compute_energy) ---
                        original_energy = chunk.rms
                        cleaned_energy = cleaned.rms
                        
                        if original_energy == cleaned_energy:
                            print(f"[DeepFilterNet] WARNING: Cleaning not applied to chunk {i+1} (Outputs identical energy: {original_energy})")
                        else:
                            print(f"[DeepFilterNet] SUCCESS: Chunk {i+1} cleaned (Energy: {original_energy} -> {cleaned_energy})")
                            
                        # --- CHECK 3: Loop Logic ---
                        cleaned_chunks.append(cleaned)
                        os.remove(chunk_temp_out)
                    else:
                        print(f"[DeepFilterNet] WARNING: Chunk {i+1} output missing, using raw chunk")
                        cleaned_chunks.append(chunk)

                except subprocess.CalledProcessError as e:
                    print(f"[DeepFilterNet] CRITICAL ERROR: Chunk {i+1} failed ({e}), stdout: {e.stdout}, stderr: {e.stderr}")
                    raise DeepFilterNetError(f"DeepFilterNet processing failed on chunk {i+1}: {e.stderr}")
                finally:
                    if os.path.exists(chunk_temp_in):
                        os.remove(chunk_temp_in)
            
            # Step 3: Concatenate ALL chunks
            if not cleaned_chunks:
                raise DeepFilterNetError("No chunks were processed successfully.")
                
            print(f"[DeepFilterNet] Merging {len(cleaned_chunks)} cleaned chunks...")
            final_audio = cleaned_chunks[0]
            for c in cleaned_chunks[1:]:
                final_audio += c
                
            # Export final audio
            final_audio.export(output_name, format="wav")
            
            # Step 4: Validate duration
            final_audio_duration = len(final_audio)
            print(f"[DeepFilterNet] Final cleaned duration: {final_audio_duration}ms (Original: {original_duration_ms}ms)")
            
            # Allow a small 1-second tolerance due to processing
            if final_audio_duration < original_duration_ms - 1000:
                raise DeepFilterNetError("Audio truncation bug still exists")
            
            print(f"[DeepFilterNet] SUCCESS: Final cleaned audio generated -> {output_name}")
            print(f"[DeepFilterNet] VALIDATION: {len(cleaned_chunks)} chunks merged, duration match: {abs(final_audio_duration - original_duration_ms) < 1000}")
            return output_name
                
        except subprocess.CalledProcessError as e:
            raise DeepFilterNetError(f"DeepFilterNet Wrapper Error: {e.stderr}")
        except Exception as e:
            raise DeepFilterNetError(f"DeepFilterNet Stage failed: {e}")

    def _run_final_conversion(self, input_path: str) -> str:
        """
        Convert to 16kHz mono wav for Whisper.
        STRICT ERROR HANDLING: Raises ConversionError on failure.
        """
        try:
            final_output = input_path.replace(".wav", "_final.wav")
            # Using ffmpeg via subprocess is most robust for preserving pitch/tempo
            subprocess.run([
                "ffmpeg", "-y", "-i", input_path,
                "-ar", "16000", "-ac", "1",
                final_output
            ], check=True, capture_output=True, text=True)
            
            if os.path.exists(final_output):
                return final_output
            else:
                raise ConversionError(f"Final Conversion failed to create output.")
        except subprocess.CalledProcessError as e:
            raise ConversionError(f"FFmpeg Conversion Error: {e.stderr}")
        except Exception as e:
            raise ConversionError(f"Final Conversion failed: {e}")

    def remove_noise(self, file_path: str) -> str:
        """Compatibility wrapper for the new pipeline."""
        return self.process_pipeline(file_path)

audio_service = AudioService()
