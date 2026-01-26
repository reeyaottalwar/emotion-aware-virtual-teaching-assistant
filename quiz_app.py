from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import our custom modules
from chatbot_module import LLM_Chatbot
from quiz_manager import QuizManager

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app) # Allow frontend to access this API

# Initialize Systems
chatbot = LLM_Chatbot()
quiz_bot = QuizManager()

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "AI Tutor Backend is running"}), 200

# --- CHATBOT ROUTES ---
@app.route('/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.json
        response = chatbot.get_response(
            data.get('conversation_id'), 
            data.get('message'), 
            data.get('user_data', {})
        )
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- QUIZ & REWARD ROUTES ---
@app.route('/quiz/generate', methods=['POST'])
def generate_quiz():
    """Generates a new quiz for a specific topic."""
    data = request.json
    result = quiz_bot.generate_quiz(
        data.get('conversation_id'), 
        data.get('topic')
    )
    return jsonify(result)

@app.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    """Evaluates answers and returns score + rewards."""
    data = request.json
    # Frontend MUST send 'user_id' to save gems
    user_id = data.get('user_id') 
    
    result = quiz_bot.evaluate_quiz(
        data.get('conversation_id'), 
        data.get('answers'),
        user_id
    )
    return jsonify(result)

@app.route('/user/gallery', methods=['GET'])
def get_gallery():
    """Fetches the user's collection of gems."""
    # Usage: GET /user/gallery?user_id=123
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
        
    result = quiz_bot.get_user_gallery(user_id)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)