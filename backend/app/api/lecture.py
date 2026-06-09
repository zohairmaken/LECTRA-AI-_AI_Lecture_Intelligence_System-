import asyncio
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.api import deps
from app.models.user import User
from app.models.lecture import Lecture
from app.schemas.all import LectureResponse, LectureFullResponse
from app.services.audio_service import audio_service
from app.services.diarization_service import diarization_service
from app.services.transcription_service import transcription_service
from app.services.explanation_service import explanation_service
from app.services.rag_service import rag_service
from app.core.gpu_manager import gpu_manager
from app.core.config import settings
import shutil
import os
import json

router = APIRouter()

@router.post("/test-sync")
async def test_pipeline_sync(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Synchronous test endpoint for pipeline verification."""
    # Save file
    file_path = os.path.join(settings.UPLOAD_DIR, "test_" + file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print("\n--- [DEBUG] STARTING SYNCHRONOUS TEST PIPELINE ---")
    
    # Create temp lecture
    new_lecture = Lecture(
        title="TEST_" + file.filename,
        filename=file.filename,
        file_path="test_" + file.filename,
        file_type=file.content_type,
        owner_id=current_user.id,
        status="Testing"
    )
    db.add(new_lecture)
    await db.commit()
    await db.refresh(new_lecture)

    # 1. Pipeline execution (Synchronous call for testing)
    from app.database import AsyncSessionLocal
    await process_lecture_pipeline(new_lecture.id, file_path, AsyncSessionLocal)
    
    await db.refresh(new_lecture)
    print("--- [DEBUG] TEST PIPELINE COMPLETED ---\n")
    
    return new_lecture

async def process_lecture_pipeline(lecture_id: int, file_path: str, db_session_factory):
    """
    7-Stage Redesigned Pipeline:
    1. Preprocessing (Noise Removal: Demucs + DeepFilterNet)
    2. Diarization (Speaker Identification)
    3. Teacher Identification (Heuristic)
    4. Rendering Transcript (Speaker + Text)
    5. AI Analysis (Summaries & Explanations)
    6. RAG Indexing
    """
    async with db_session_factory() as db:
        lecture = await db.get(Lecture, lecture_id)
        if not lecture: 
            print(f"[PIPELINE ERROR] Lecture {lecture_id} not found in DB.")
            return

        print(f"\n[EXECUTION START] Pipeline for Lecture {lecture_id} | Path: {file_path}")
        print(f"[PIPELINE INFO] File size: {os.path.getsize(file_path)} bytes")
        
        # Setup file logging
        import logging
        logging.basicConfig(filename='pipeline_debug.log', level=logging.INFO, force=True)
        logger = logging.getLogger(__name__)

        try:
            # -------------------------------------------------------------------
            # Parallel Workers Setup
            # -------------------------------------------------------------------
            
            async def worker_enhancement(target_file: str):
                """Worker 1: Audio Enhancement Pipeline"""
                async with db_session_factory() as local_db:
                    lec = await local_db.get(Lecture, lecture_id)
                    lec.status_audio = "Processing"
                    await local_db.commit()
                    
                    print("[PARALLEL] Start: Audio Enhancement")
                    async with gpu_manager:
                        processed_path = await asyncio.to_thread(audio_service.process_pipeline, target_file)
                    
                    lec.clean_file_path = os.path.basename(processed_path)
                    lec.status_audio = "Ready"
                    await local_db.commit()
                    print("[PARALLEL] Done: Audio Enhancement")
                    return processed_path

            async def worker_transcription(target_file: str):
                """Worker 2: Whisper Transcription"""
                async with db_session_factory() as local_db:
                    lec = await local_db.get(Lecture, lecture_id)
                    lec.status_transcript = "Processing"
                    await local_db.commit()
                    
                    print("[PARALLEL] Start: Transcription")
                    async with gpu_manager:
                        raw_transcript, duration = await asyncio.to_thread(transcription_service.transcribe, target_file)
                    
                    lec.transcript_json = json.dumps(raw_transcript)
                    lec.duration = duration
                    lec.status_transcript = "Ready"
                    await local_db.commit()
                    print("[PARALLEL] Done: Transcription")
                    return raw_transcript

            async def worker_diarization(target_file: str):
                """Worker 3: Pyannote Diarization"""
                async with db_session_factory() as local_db:
                    lec = await local_db.get(Lecture, lecture_id)
                    lec.status_diarization = "Processing"
                    await local_db.commit()
                    
                    print("[PARALLEL] Start: Diarization")
                    async with gpu_manager:
                        segments = await asyncio.to_thread(diarization_service.diarize, target_file, duration=lec.duration)
                    
                    lec.diarization_json = json.dumps(segments)
                    lec.status_diarization = "Ready"
                    await local_db.commit()
                    print("[PARALLEL] Done: Diarization")
                    return segments

            # -------------------------------------------------------------------
            # STAGE 0: Video Audio Extraction (Serial, needed for all workers)
            # -------------------------------------------------------------------
            import mimetypes
            import subprocess
            mime_type, _ = mimetypes.guess_type(file_path)
            if mime_type and mime_type.startswith('video'):
                lecture.status = "Extracting Audio"
                await db.commit()
                base, ext = os.path.splitext(file_path)
                audio_path = base + "_extracted.wav"
                subprocess.run(['ffmpeg', '-i', file_path, '-vn', '-acodec', 'pcm_s16le', '-ar', '44100', '-ac', '2', audio_path, '-y'], check=True, capture_output=True)
                file_path = audio_path

            # -------------------------------------------------------------------
            # EXECUTE HYBRID PARALLEL PIPELINE
            # -------------------------------------------------------------------
            lecture.status = "Processing Parallel Tasks"
            await db.commit()
            
            # Step 1: Run Enhancement and Transcription in parallel
            # Transcription is robust to noise and can start immediately
            print("[PIPELINE] Starting Parallel Stage 1: Enhancement & Transcription")
            stage1_results = await asyncio.gather(
                worker_enhancement(file_path),
                worker_transcription(file_path),
                return_exceptions=True
            )

            # Check for errors in Stage 1
            for res in stage1_results:
                if isinstance(res, Exception):
                    raise res
            
            clean_path, transcript_raw = stage1_results
            
            # Step 2: Run Diarization on the CLEANED audio for maximum accuracy
            # This ensures short "Present" responses aren't missed by VAD/Noise
            print("[PIPELINE] Starting Parallel Stage 2: Diarization (on Cleaned Audio)")
            diarization_segments = await worker_diarization(clean_path)
            
            # Update DB with final results
            await db.refresh(lecture)
            
            # -------------------------------------------------------------------
            # FINALIZATION: Teacher ID & AI Synthesis (Sequential)
            # -------------------------------------------------------------------
            lecture.status = "Finalizing Results"
            await db.commit()
            
            teacher_speaker = diarization_service.identify_teacher(diarization_segments)
            
            # Merge & Synthesis
            final_transcript = transcription_service.merge_diarization(
                transcript_raw, 
                diarization_segments, 
                teacher_speaker=teacher_speaker
            )
            full_text = "\n".join([f"{s['speaker']}: {s['text']}" for s in final_transcript])
            lecture.transcript_text = full_text
            
            lecture.summary = await explanation_service.generate_summary(full_text)
            lecture.explanation_beginner = await explanation_service.generate_explanation(full_text, "beginner")
            lecture.explanation_intermediate = await explanation_service.generate_explanation(full_text, "intermediate")
            lecture.explanation_advanced = await explanation_service.generate_explanation(full_text, "advanced")
            
            rag_service.add_lecture(lecture_id, full_text)
            
            lecture.status = "Completed"
            await db.commit()
            print(f"[EXECUTION SUCCESS] Pipeline finished for Lecture {lecture_id}\n")

        except Exception as main_e:
            print(f"\n[PIPELINE CRITICAL FAILURE] {main_e}")
            logger.error(f"PIPELINE FAILURE: {main_e}", exc_info=True)
            import traceback
            traceback.print_exc()
            
            # Descriptive Error Feedback
            error_msg = str(main_e)
            if "Demucs" in error_msg: lecture.status = "Failed: Demucs Isolation"
            elif "SepFormer" in error_msg: lecture.status = "Failed: SepFormer Stage"
            elif "DeepFilterNet" in error_msg: lecture.status = "Failed: Noise Removal"
            elif "VAD" in error_msg: lecture.status = "Failed: Voice Detection"
            elif "Mastering" in error_msg: lecture.status = "Failed: Audio Mastering"
            else: lecture.status = f"Failed: {error_msg[:30]}..."
            
            await db.commit()

@router.post("/upload", response_model=LectureResponse)
async def upload_lecture(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Save file
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create DB Entry — store just the filename
    new_lecture = Lecture(
        title=file.filename,
        filename=file.filename,
        file_path=file.filename,
        file_type=file.content_type,
        owner_id=current_user.id
    )
    db.add(new_lecture)
    await db.commit()
    await db.refresh(new_lecture)

    # Trigger Background Task
    from app.database import AsyncSessionLocal
    background_tasks.add_task(process_lecture_pipeline, new_lecture.id, file_path, AsyncSessionLocal)

    return new_lecture

@router.get("/{lecture_id}/status")
async def get_lecture_status(
    lecture_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Lightweight endpoint for polling processing status."""
    result = await db.execute(
        select(Lecture).where(Lecture.id == lecture_id, Lecture.owner_id == current_user.id)
    )
    lecture = result.scalars().first()
    if not lecture:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Lecture not found")
    return {
        "id": lecture.id,
        "status": lecture.status,
        "status_audio": lecture.status_audio,
        "status_transcript": lecture.status_transcript,
        "status_diarization": lecture.status_diarization,
        "filename": lecture.filename,
        "clean_file_path": lecture.clean_file_path,
        "title": lecture.title,
        "duration": lecture.duration,
    }

@router.get("/", response_model=list[LectureResponse])
async def get_lectures(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Lecture).where(Lecture.owner_id == current_user.id))
    return result.scalars().all()

@router.get("/{lecture_id}", response_model=LectureFullResponse)
async def get_lecture(
    lecture_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Lecture).where(Lecture.id == lecture_id, Lecture.owner_id == current_user.id))
    lecture = result.scalars().first()
    if not lecture:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Lecture not found")
    return lecture
