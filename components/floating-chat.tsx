"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your quick learning assistant. How can I help?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getQuickResponse(inputText),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const getQuickResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("course")) {
      return "Check your Courses page for recommendations!"
    } else if (input.includes("progress")) {
      return "Your progress looks great! Visit the Progress page for details."
    } else if (input.includes("achievement")) {
      return "You have new achievements! Check the Achievements page."
    } else if (input.includes("help")) {
      return "I'm here to help! Visit the Chat page for detailed assistance."
    } else {
      return "For detailed help, visit the Chat page. Quick question?"
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        <i
          data-feather={isOpen ? "x" : "message-circle"}
          className="w-6 h-6 text-white transition-transform group-hover:scale-110"
        ></i>
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 glass-card rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                  <i data-feather="bot" className="w-4 h-4 text-white"></i>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Quick Assistant</h3>
                  <p className="text-purple-200 text-xs">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-purple-200 hover:text-white transition-colors">
                <i data-feather="minimize-2" className="w-4 h-4"></i>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[200px] px-3 py-2 rounded-lg text-xs ${
                    message.sender === "user"
                      ? "bg-purple-500 text-white"
                      : "bg-white/10 text-white border border-white/20"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white border border-white/20 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/20">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Quick question..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-purple-200 focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i data-feather="send" className="w-3 h-3"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
