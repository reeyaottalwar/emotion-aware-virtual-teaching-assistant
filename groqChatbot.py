import os
from typing import Dict, Any
from dotenv import load_dotenv
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.messages import SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_groq import ChatGroq

# Load environment variables (needed to ensure GROQ_API_KEY is available)
load_dotenv() 

MAX_HISTORY_MESSAGES = 10 

class LLM_Chatbot:
    def __init__(self):
        # Initialize Groq LLM 
        self.llm = ChatGroq(model=os.environ.get("GROQ_MODEL", "mixtral-8x7b-8096"), temperature=0.7)
        self.chain = self._build_chain()
        # In-memory history store, keyed by conversation_id
        self.history_store: Dict[str, ChatMessageHistory] = {}
        
        if not os.environ.get("GROQ_API_KEY"):
            print("WARNING: GROQ_API_KEY not found. Using generic fallback.")

    def _generate_system_prompt(self, user_data: Dict[str, Any]) -> str:
        """Generates the personalized, emotion-aware system prompt."""
        emotion = user_data.get('emotion_detected', 'Neutral')
        context = user_data.get('context', 'a student')
        likes = user_data.get('likes', 'learning')

        system_prompt = (
            f"You are the Emotion-Aware Virtual Teaching Assistant (VTA). Your primary role is educational. "
            f"The student's profile is: Context='{context}', Likes='{likes}'. "
            f"The student's current emotional state is **{emotion.upper()}**. "
            f"Adapt your tone based on the emotion: If {emotion} is Confused/Fear, be encouraging; if Boredom, be engaging. "
            f"Keep your response concise and focused on the learning material (max 3-4 paragraphs)."
        )
        return system_prompt

    def _build_chain(self):
        """Builds the core LangChain pipeline."""
        # This prompt is flexible to accept a system message (updated per turn) and history
        prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="system_message"), 
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}"),
            ]
        )
        return prompt | self.llm | StrOutputParser()
    
    def _get_session_history(self, session_id: str) -> ChatMessageHistory:
        """Retrieves or creates the chat history for a session."""
        if session_id not in self.history_store:
            self.history_store[session_id] = ChatMessageHistory()
        return self.history_store[session_id]

    def get_response(self, conversation_id: int, user_message: str, user_data: Dict[str, Any]) -> str:
        """
        Main call function to get an LLM response.
        """
        session_id = str(conversation_id)
        
        system_text = self._generate_system_prompt(user_data)
        system_message_lc = SystemMessage(content=system_text)
        history = self._get_session_history(session_id)

        # 1. Add current user message to history
        history.add_user_message(user_message)

        try:
            # 2. Invoke the chain
            result = self.chain.invoke(
                {
                    "input": user_message,
                    "system_message": [system_message_lc],
                    "history": history.messages[:-1] # Send all *previous* messages
                },
                config={}
            )
            ai_text = result
        except Exception as e:
            print(f"Groq/LangChain API Error: {e}")
            ai_text = f"I apologize, {user_data.get('username', 'Learner')}, I'm currently unable to access my knowledge base."

        # 3. Add AI response to history and trim
        history.add_ai_message(ai_text)
        self._trim_history_buffer(history)
        
        return ai_text

    def _trim_history_buffer(self, history: ChatMessageHistory, max_messages: int = MAX_HISTORY_MESSAGES) -> None:
        """Keeps only the most recent N messages in memory."""
        if len(history.messages) > max_messages:
            history.messages = history.messages[-max_messages:]

# Global instance for Flask application use
llm_chatbot = LLM_Chatbot()