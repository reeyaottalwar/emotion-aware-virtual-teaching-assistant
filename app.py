from flask import Flask, jsonify, request, session, redirect, url_for, render_template 
from flask_socketio import SocketIO
from flask_dance.contrib.google import make_google_blueprint, google
from flask_dance.contrib.github import make_github_blueprint, github
import os
from dotenv import load_dotenv
from database import db, User
from werkzeug.security import check_password_hash

# Set this environment variable for local testing with HTTP
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Load environment variables
load_dotenv()

# Create the Flask app instance
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'a-default-secret-key')

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database with the app.py
db.init_app(app)

# Wrap Flask app with SocketIO - CORS enabled
socketio = SocketIO(app, cors_allowed_origins="*")

# Function to create database tables
def create_db():
    with app.app_context():
        db.create_all()
        print("Database tables created!")

# Configure Flask-Dance blueprints
google_bp = make_google_blueprint(
    client_id=os.environ.get("GOOGLE_OAUTH_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_OAUTH_CLIENT_SECRET"),
    scope=["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
)

github_bp = make_github_blueprint(
    client_id=os.environ.get("GITHUB_OAUTH_CLIENT_ID"),
    client_secret=os.environ.get("GITHUB_OAUTH_CLIENT_SECRET"),
    scope=["user:email"]
)

# Register blueprints with the app
app.register_blueprint(google_bp, url_prefix="/login")
app.register_blueprint(github_bp, url_prefix="/login")

# Rendering index.html
@app.route('/')
def index():
    return render_template('index.html')

# Unified handler for all social logins
@app.route("/login/<provider>/authorized")
def social_login_handler(provider):
    if provider == 'google':
        service = google
    elif provider == 'github':
        service = github
    else:
        return jsonify({"message": "Invalid provider"}), 400

    if not service.authorized:
        return redirect(url_for(f"{provider}.login"))

    # user info from the provider's API
    if provider == 'google':
        resp = service.get("/oauth2/v2/userinfo")
        email = resp.json()["email"]
        name = resp.json().get("name")
        username = email.split('@')[0]
    elif provider == 'github':
        resp = service.get("/user/emails")
        email = resp.json()[0]["email"]
        resp = service.get("/user")
        username = resp.json()["login"]
        name = resp.json().get("name", username)

    # Check for an existing user
    user = User.query.filter_by(email=email).first()

    # create a new user if one does not exist
    if not user:
        user = User(name=name, username=username, email=email, password=os.urandom(16).hex())
        db.session.add(user)
        db.session.commit()
    
    session['user_id'] = user.id
    return render_template('redirect.html')

# Checking if log-in was successful
@app.route('/check_session')
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify({
                'is_authenticated': True, 
                'username': user.username
            }), 200
    
    return jsonify({'is_authenticated': False}), 200

# Sign-up rendering
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not all([name, username, email, password, confirm_password]):
        return jsonify({'success': False, 'message': 'Missing fields'}), 400
    if password != confirm_password:
        return jsonify({'success': False, 'message': 'Passwords do not match'}), 400

    existing_user_email = User.query.filter_by(email=email).first()
    existing_user_username = User.query.filter_by(username=username).first()
    
    if existing_user_email or existing_user_username:
        return jsonify({'success': False, 'message': 'Email or username already registered'}), 409

    new_user = User(name=name, username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    # Log in the user by setting the session ID after successful signup
    session['user_id'] = new_user.id

    return jsonify({'success': True, 'message': 'User created successfully'}), 201

# for profile updates
@app.route('/api/profile', methods=['PUT'])
def update_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Authentication required'}), 401

    data = request.get_json()
    likes = data.get('likes')
    dislikes = data.get('dislikes')
    context = data.get('context')

    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    user.likes = ','.join(likes) if likes else ''
    user.dislikes = ','.join(dislikes) if dislikes else ''
    user.context = context
    db.session.commit()

    return jsonify({'success': True, 'message': 'Profile updated successfully'}), 200

# Login 
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password')

    if not all([identifier, password]):
        return jsonify({'success': False, 'message': 'Missing fields'}), 400

    user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()

    if user and user.check_password(password):
        session['user_id'] = user.id
        return jsonify({'success': True, 'message': 'Login successful'}), 200
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# log-out
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True, 'message': 'Logged out successfully'})


# @socketio.on('connect')
# def handle_connect():
#     print('Client connected')

# For Video-based emotion-detection module 
@socketio.on('video_stream')
def handle_video_stream(data):
    print("Received video stream data.")
    emit('video_response', {'emotion': 'neutral'})

# For Voice-based emotion-detection module
@socketio.on('audio_stream')
def handle_audio_stream(data):
    print("Received audio stream data.")
    emit('audio_response', {'emotion': 'calm'})

# Main 
if __name__ == '__main__':
    create_db()
    socketio.run(app, debug=True)