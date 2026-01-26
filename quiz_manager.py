import os
from typing import Dict, Any
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.messages import SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_groq import ChatGroq

MAX_HISTORY_MESSAGES = 10 

class LLM_Chatbot:
    def __init__(self):
        self.llm = ChatGroq(model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"), temperature=0.7)
        self.chain = self._build_chain()
        self.history_store: Dict[str, ChatMessageHistory] = {}

    def _generate_system_prompt(self, user_data: Dict[str, Any]) -> str:
        # Simplified for brevity - paste your full custom prompt logic here
        context = user_data.get('context', 'a student')
        return f"You are an Emotion-Aware Teaching Assistant for {context}. Use a helpful and engaging tone."

    def _build_chain(self):
        prompt = ChatPromptTemplate.from_messages([
            MessagesPlaceholder(variable_name="system_message"), 
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])
        return prompt | self.llm | StrOutputParser()
    
    def _get_session_history(self, session_id: str) -> ChatMessageHistory:
        if session_id not in self.history_store:
            self.history_store[session_id] = ChatMessageHistory()
        return self.history_store[session_id]

    def get_response(self, conversation_id: int, user_message: str, user_data: Dict[str, Any]) -> str:
        session_id = str(conversation_id)
        system_text = self._generate_system_prompt(user_data)
        system_message_lc = SystemMessage(content=system_text)
        history = self._get_session_history(session_id)
        
        history.add_user_message(user_message)
        
        try:
            result = self.chain.invoke(
                {"input": user_message, "system_message": [system_message_lc], "history": history.messages[:-1]}
            )
            ai_text = result
        except Exception:
            ai_text = "I'm having trouble connecting right now."

        history.add_ai_message(ai_text)
        if len(history.messages) > MAX_HISTORY_MESSAGES:
            history.messages = history.messages[-MAX_HISTORY_MESSAGES:]
            
        return ai_text