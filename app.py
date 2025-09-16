from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Create the Flask application instance
app = Flask(__name__)

# Set a secret key from environment variables for security
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'a_default_secret_key_if_not_set')

# Wrap the Flask app with SocketIO to enable WebSockets
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    """
    The main route for the application.
    This will later serve the index.html file from the templates folder.
    """
    # For now, we'll just return a simple message to confirm the server is running.
    return "Backend server is running. Awaiting WebSocket connections..."

@socketio.on('video_stream')
def handle_video_stream(data):
    """
    Handles incoming video data from the frontend.
    The `data` parameter will contain the video frame (e.g., a base64 encoded string).
    """
    print("Received video stream data. Processing...")
    # For Week 1, we will just echo a placeholder response.
    # In a later week, you will call the Video Emotion Lead's module here.
    # emotion_label = video_emotion_lead_module.detect_emotion(data)
    # emit('video_response', {'emotion': emotion_label})
    emit('video_response', {'emotion': 'neutral'})

@socketio.on('audio_stream')
def handle_audio_stream(data):
    """
    Handles incoming audio data from the frontend.
    The `data` parameter will contain the audio chunk.
    """
    print("Received audio stream data. Processing...")
    # For Week 1, we will just echo a placeholder response.
    # In a later week, you will call the Audio Emotion Lead's module here.
    # emotion_label = audio_emotion_lead_module.detect_emotion(data)
    # emit('audio_response', {'emotion': emotion_label})
    emit('audio_response', {'emotion': 'calm'})

if __name__ == '__main__':
    # Use SocketIO's `run` method to start the server. This handles both
    # HTTP and WebSocket connections.
    socketio.run(app, debug=True)