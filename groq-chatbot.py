#!/usr/bin/env python3
"""
Simple LangChain + Groq chatbot with a memory buffer.

Prereqs (as comments for reference):
- pip install langchain langchain-core langchain-community langchain-groq

Environment:
- Set GROQ_API_KEY in your environment for authentication.

Usage:
- Run this script, then type messages. Type 'exit' or 'quit' to end the session.
- Memory buffer keeps the last N messages per session_id.
"""

import os
import sys
import uuid
from typing import Dict

from dotenv import load_dotenv
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.messages import SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_groq import ChatGroq

MAX_HISTORY_MESSAGES = 20  # how many messages to keep in memory per session
# change if you prefer another Groq model
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")

def require_env_var(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(
            f"Missing environment variable: {name}. Please set it before running the script."
        )
    return value


def build_chain():
    # Initialize Groq LLM via LangChain integration.
    # ChatGroq reads GROQ_API_KEY from the environment automatically.
    llm = ChatGroq(model=GROQ_MODEL, temperature=0.2)

    # Prompt with history placeholder to inject the conversation memory.
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(
                content=(
                    "You are a helpful AI assistant. Answer clearly and concisely. "
                    "If the user asks for code, provide well-formatted examples."
                )
            ),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ]
    )

    # LCEL pipeline: prompt -> llm -> string
    chain = prompt | llm | StrOutputParser()
    return chain


# In-memory store for session histories. In production, replace with a persistent store.
_history_store: Dict[str, ChatMessageHistory] = {}


def get_session_history(session_id: str) -> ChatMessageHistory:
    if session_id not in _history_store:
        _history_store[session_id] = ChatMessageHistory()
    return _history_store[session_id]


def trim_history_buffer(history: ChatMessageHistory, max_messages: int = MAX_HISTORY_MESSAGES) -> None:
    # Each user+AI exchange adds two messages; adjust max to your needs.
    if len(history.messages) > max_messages:
        # drop from the start (oldest first)
        history.messages = history.messages[-max_messages:]


def make_chatbot_with_memory():
    chain = build_chain()

    # Wrap chain with message history to maintain memory across turns.
    with_history = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="history",
    )
    return with_history


def chat_once(with_history, session_id: str, user_input: str) -> str:
    """Send one user message, return the AI reply as text."""
    result = with_history.invoke(
        {"input": user_input},
        config={"configurable": {"session_id": session_id}},
    )
    # After the turn, trim history to enforce buffer size
    history = get_session_history(session_id)
    trim_history_buffer(history)
    return result


def interactive_cli():
    # Load environment variables from .env file
    load_dotenv()
    
    # Ensure the API key exists (ChatGroq will read it implicitly)
    # The intended environment variable is GROQ_API_KEY (set this to your Groq API key).
    require_env_var("GROQ_API_KEY")

    with_history = make_chatbot_with_memory()
    session_id = os.environ.get("CHAT_SESSION_ID") or str(uuid.uuid4())

    print(f"[LangChain Groq Chat] Session ID: {session_id}")
    print("Type your message. Type 'exit' or 'quit' to stop.")
    while True:
        try:
            user_input = input("\nYou: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if user_input.lower() in {"exit", "quit"}:
            print("Goodbye!")
            break

        try:
            ai_text = chat_once(with_history, session_id, user_input)
            print(f"AI: {ai_text}")
        except Exception as e:
            print(f"[error] {e}", file=sys.stderr)


if __name__ == "__main__":
    interactive_cli()
