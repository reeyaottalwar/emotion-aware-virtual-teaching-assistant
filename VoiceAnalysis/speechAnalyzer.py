import os
# os.environ["TRANSFORMERS_NO_TF"] = "1" # Keep this line to suppress warnings

from transformers import pipeline
import librosa
import soundfile as sf
import io
import numpy as np

# --- CONFIGURATION (Match Frontend) ---
RATE = 16000
SEGMENT_DURATION = 1.0  # seconds

# --- MODEL INITIALIZATION (Load once when the server starts) ---
print("Loading Speech Emotion Recognition model...")
# This pipeline handles both feature extraction and prediction
try:
    SER_PIPELINE = pipeline(
        "audio-classification",
        model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
    )
    print("Emotion model loaded successfully.")
except Exception as e:
    print(f"Error loading SER model: {e}")
    SER_PIPELINE = None

# --- CORE ANALYSIS FUNCTION ---
# This replaces the logic from detect_emotion_percentage and main()
def analyze_audio_blob(audio_blob):
    """
    Accepts raw audio data (blob) and returns the dominant emotion and a placeholder transcription.
    """
    if not SER_PIPELINE:
         return {'transcription': 'SER Model failed to load.', 'emotion': 'Neutral'}

    if not audio_blob:
        return {'transcription': '', 'emotion': 'Neutral'}

    # The audio_blob from the frontend is typically a raw file buffer (BytesIO or similar) 
    # that needs to be loaded by librosa/soundfile.
    # We save it temporarily to a file-like object or disk for processing.
    try:
        # 1. Load the audio data from the blob/buffer
        y, sr = sf.read(io.BytesIO(audio_blob.read()), dtype='float32') # Requires soundfile to read raw buffer
    except AttributeError:
         # If audio_blob is already bytes (common in socketio)
        y, sr = sf.read(io.BytesIO(audio_blob), dtype='float32') 
    except Exception as e:
         # Fallback if buffer reading fails (common issue with socketio/blobs)
        print(f"Failed to read audio blob: {e}. Simulating result.")
        return {'transcription': 'Audio input error. Please check your microphone.', 'emotion': 'Neutral'}

    # Resample if necessary (Wav2Vec models often need 16000Hz)
    if sr != RATE:
        y = librosa.resample(y, orig_sr=sr, target_sr=RATE)
        sr = RATE

    total_samples = len(y)
    segment_samples = int(SEGMENT_DURATION * sr)

    emotions_count = {"angry": 0, "happy": 0, "neutral": 0, "sad": 0}
    num_segments = 0

    # 2. Segment and Predict (similar to your original logic)
    for start in range(0, total_samples, segment_samples):
        end = min(start + segment_samples, total_samples)
        segment = y[start:end]

        # Save segment to an in-memory buffer for the pipeline
        buffer = io.BytesIO()
        sf.write(buffer, segment, sr, format='wav')
        buffer.seek(0)

        try:
            # The pipeline expects a file path or buffer object
            result = SER_PIPELINE(buffer.read()) # Pass the bytes content

            raw_label = result[0]['label'].lower()

            if "angry" in raw_label or "disgust" in raw_label:
                emotions_count["angry"] += 1
            elif "happy" in raw_label or "surprise" in raw_label:
                emotions_count["happy"] += 1
            elif "sad" in raw_label or "fear" in raw_label:
                emotions_count["sad"] += 1
            else:
                emotions_count["neutral"] += 1

            num_segments += 1

        except Exception as e:
            print(f"Segment prediction failed: {e}")

    # 3. Determine Dominant Emotion and Transcription
    dominant_emotion = max(emotions_count, key=emotions_count.get) if num_segments > 0 else 'Neutral'

    # NOTE: STT (Speech-to-Text) model is not included here. We return a placeholder.
    transcribed_text = f"Transcription placeholder: Your voice was detected, and emotion analysis showed {dominant_emotion.upper()}."

    return {
        'transcription': transcribed_text,
        'emotion': dominant_emotion.capitalize()
    }

# You will need to remove the main() and record_audio() functions from the original main.py
# as they are CLI-focused and conflict with Flask-SocketIO.
# The client-side JS handles the audio recording/streaming.