import time
import os
import asyncio

def run():
    print("=== TESTING AUDIO SERVICE ===")
    from app.services.audio_service import audio_service
    audio_service._initialize()
    try:
        res = audio_service.process_pipeline("dummy.wav")
        print("Audio output:", res, "Exists:", os.path.exists(res) if res else False)
    except Exception as e:
        print("AUDIO EXCEPTION:", e)
        import traceback
        traceback.print_exc()

    print("\n=== TESTING DIARIZATION SERVICE ===")
    from app.services.diarization_service import diarization_service
    diarization_service._load_pipeline()
    try:
        # We will use dummy.wav which works locally
        segs = diarization_service.diarize("dummy.wav")
        print("Diarization output:", segs)
        teacher = diarization_service.identify_teacher(segs)
        print("Teacher identified:", teacher)
    except Exception as e:
        print("DIAR EXCEPTION:", e)
        import traceback
        traceback.print_exc()

    print("\n=== TESTING TRANSCRIPTION SERVICE ===")
    from app.services.transcription_service import transcription_service
    transcription_service._initialize()
    try:
        ts, dur = transcription_service.transcribe("dummy.wav")
        print("Transcription length:", len(ts), "Duration:", dur)
    except Exception as e:
        print("TRANS EXCEPTION:", e)
        import traceback
        traceback.print_exc()

    print("\n=== TESTING QUIZ SERVICE ===")
    from app.services.quiz_service import quiz_service
    try:
        print("Testing quiz LLM...")
        res = asyncio.run(quiz_service.generate_quiz("This is a test transcript."))
        print("Quiz output length:", len(res) if res else "None")
    except Exception as e:
        print("QUIZ EXCEPTION:", e)
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    run()
