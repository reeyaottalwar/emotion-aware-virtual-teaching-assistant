from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize SQLAlchemy outside of the app instance
db = SQLAlchemy()

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=True)  # Now nullable for social logins
    
    # New fields for social login
    social_id = db.Column(db.String(255), unique=True, nullable=True)
    
    def __init__(self, name, username, email, password=None, social_id=None):
        self.name = name
        self.username = username
        self.email = email
        self.social_id = social_id
        if password:
            self.password_hash = generate_password_hash(password)

    def __repr__(self):
        return f'<User {self.username}>'

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)