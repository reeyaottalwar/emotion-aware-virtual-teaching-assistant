#pip install pyaudio numpy transformers librosa soundfile torch matplotlib scikit-learn pandas
# -------------------------------
# Real-time Emotion Detection with Percentage of Each Emotion
# -------------------------------

import os
os.environ["TRANSFORMERS_NO_TF"] = "1"  # Disable TensorFlow/Keras warnings

import pyaudio
import wave
import threading
import numpy as np
from transformers import pipeline
import librosa
import soundfile as sf  # <-- Use this for saving audio segments

# ---------------- CONFIGURATION ----------------
AUDIO_FILE = "recorded_audio.wav"
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK = 1024
SEGMENT_DURATION = 1.0  # seconds

# ---------------- RECORDING FUNCTION ----------------
def record_audio(stop_event):
    audio = pyaudio.PyAudio()
    stream = audio.open(format=FORMAT,
                        channels=CHANNELS,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK)

    frames = []
    print("\nRecording... Press ENTER again to stop.\n")

    while not stop_event.is_set():
        data = stream.read(CHUNK, exception_on_overflow=False)
        frames.append(data)

    stream.stop_stream()
    stream.close()
    audio.terminate()

    wf = wave.open(AUDIO_FILE, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(audio.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

    print("Recording saved as", AUDIO_FILE)
    return AUDIO_FILE

# ---------------- EMOTION PERCENTAGE FUNCTION ----------------
def detect_emotion_percentage(audio_path, ser_pipeline):
    """
    Splits audio into segments, runs SER on each, and calculates percentage of each emotion.
    Only outputs: angry, happy, neutral, sad
    """
    print("\n Analyzing emotion percentages...")

    y, sr = librosa.load(audio_path, sr=RATE)
    total_samples = len(y)
    segment_samples = int(SEGMENT_DURATION * sr)

    emotions_count = {"angry": 0, "happy": 0, "neutral": 0, "sad": 0}
    num_segments = 0

    for start in range(0, total_samples, segment_samples):
        end = min(start + segment_samples, total_samples)
        segment = y[start:end]

        # Save temp segment file using soundfile
        temp_file = "temp_segment.wav"
        sf.write(temp_file, segment, sr)

        try:
            result = ser_pipeline(temp_file)
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
            print(f"Segment processing failed: {e}")
        finally:
            if os.path.exists(temp_file):
                os.remove(temp_file)

    print("\nEmotion Percentages in Audio:")
    for e, count in emotions_count.items():
        percentage = (count / num_segments * 100) if num_segments > 0 else 0
        print(f"  {e.capitalize():7}: {percentage:.1f}%")

    dominant_emotion = max(emotions_count, key=emotions_count.get)
    print(f"\n Dominant Emotion: {dominant_emotion.upper()}\n")

    return emotions_count

# ---------------- MAIN FUNCTION ----------------
def main():
    print("Loading Emotion Recognition model (this may take a minute)...")
    ser_pipeline = pipeline(
        "audio-classification",
        model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
    )
    print("Emotion model loaded successfully.\n")

    input("Press ENTER to start recording...")

    stop_event = threading.Event()
    recording_thread = threading.Thread(target=record_audio, args=(stop_event,))
    recording_thread.start()

    input("Press ENTER to stop recording...\n")
    stop_event.set()
    recording_thread.join()

    detect_emotion_percentage(AUDIO_FILE, ser_pipeline)

    if os.path.exists(AUDIO_FILE):
        os.remove(AUDIO_FILE)

if __name__ == "__main__":
    main()