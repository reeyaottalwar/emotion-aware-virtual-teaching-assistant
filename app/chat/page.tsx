"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  videoUrl?: string
  videoTitle?: string
}

interface ChatSession {
  id: string
  name: string
  messages: Message[]
  createdAt: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your learning assistant. How can I help you today? You can also paste video links in the video player section and I'll help you understand the content!",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [currentVideo, setCurrentVideo] = useState<{
    url: string
    title: string
    platform: string
    videoId: string
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const detectVideoUrl = (text: string): { isVideo: boolean; url?: string; platform?: string; videoId?: string } => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/

    const youtubeMatch = text.match(youtubeRegex)
    const vimeoMatch = text.match(vimeoRegex)

    if (youtubeMatch) {
      return {
        isVideo: true,
        url: text,
        platform: "youtube",
        videoId: youtubeMatch[1],
      }
    } else if (vimeoMatch) {
      return {
        isVideo: true,
        url: text,
        platform: "vimeo",
        videoId: vimeoMatch[1],
      }
    }

    return { isVideo: false }
  }

  const getVideoEmbedUrl = (platform: string, videoId: string): string => {
    if (platform === "youtube") {
      return `https://www.youtube.com/embed/${videoId}`
    } else if (platform === "vimeo") {
      return `https://player.vimeo.com/video/${videoId}`
    }
    return ""
  }

  const extractVideoTitle = (url: string): string => {
    const videoInfo = detectVideoUrl(url)
    if (videoInfo.platform === "youtube") {
      return "YouTube Video"
    } else if (videoInfo.platform === "vimeo") {
      return "Vimeo Video"
    }
    return "Video"
  }

  const handleLoadVideo = () => {
    if (!videoUrl.trim()) return

    const videoInfo = detectVideoUrl(videoUrl)
    if (videoInfo.isVideo && videoInfo.videoId) {
      setCurrentVideo({
        url: videoUrl,
        title: extractVideoTitle(videoUrl),
        platform: videoInfo.platform!,
        videoId: videoInfo.videoId,
      })

      // Add bot message about video being loaded
      const botMessage: Message = {
        id: Date.now().toString(),
        text: `Great! I've loaded the video in the player. I can now help you with:\n\n• Understanding key concepts\n• Creating study notes\n• Generating practice questions\n• Explaining difficult topics\n• Connecting to your courses\n\nFeel free to ask me anything about the video content!`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } else {
      alert("Please enter a valid YouTube or Vimeo URL")
    }
  }

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

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText, !!currentVideo),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (userInput: string, hasVideo = false): string => {
    const input = userInput.toLowerCase()

    if (hasVideo) {
      if (input.includes("summary") || input.includes("summarize")) {
        return "Based on the video content, here are the key points:\n\n• Main topic overview and objectives\n• Important concepts and definitions\n• Practical examples and applications\n• Key takeaways for your learning\n\nWould you like me to elaborate on any specific section?"
      } else if (input.includes("notes") || input.includes("study")) {
        return "Here are structured study notes from the video:\n\n📝 **Key Concepts:**\n• [Concept 1] - Brief explanation\n• [Concept 2] - Brief explanation\n\n💡 **Important Points:**\n• Critical information to remember\n• Practical applications\n\n❓ **Questions to Consider:**\n• How does this relate to your current courses?\n• What are the real-world applications?"
      } else if (input.includes("question") || input.includes("quiz")) {
        return "Here are practice questions based on the video:\n\n1. What is the main concept discussed in the video?\n2. How can you apply this knowledge practically?\n3. What are the key benefits mentioned?\n4. Can you explain the relationship between [concept A] and [concept B]?\n\nWould you like me to provide answers or create more questions?"
      } else if (input.includes("explain") || input.includes("understand")) {
        return "I'd be happy to explain any part of the video! The content covers several important topics that connect well with your learning goals. Which specific concept would you like me to break down further?"
      }
    }

    if (input.includes("video") || input.includes("watch") || input.includes("youtube") || input.includes("vimeo")) {
      return "You can paste any video link in the Video Player section above, and I'll help you understand the content! I can provide summaries, key points, study notes, and answer questions about the video material."
    } else if (input.includes("course") || input.includes("learn")) {
      return "I can help you find the perfect course! Based on your progress, I recommend focusing on advanced topics in your current subjects. Would you like me to suggest specific courses?"
    } else if (input.includes("progress") || input.includes("score")) {
      return "Your learning progress is impressive! You've completed 75% of your current courses with an average score of 87%. Keep up the great work!"
    } else if (input.includes("achievement") || input.includes("badge")) {
      return "You've earned 12 achievements so far! Your latest badge was 'Quick Learner' for completing 5 lessons in one day. What's your next goal?"
    } else if (input.includes("help") || input.includes("support")) {
      return "I'm here to help with your learning journey! I can assist with course recommendations, progress tracking, study tips, video analysis, and answering questions about your dashboard."
    } else {
      return "That's an interesting question! I'm here to help with your learning journey. Feel free to ask about courses, progress, achievements, video content, or any study-related topics."
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const saveCurrentSession = () => {
    if (messages.length <= 1) return

    const sessionName = `Chat ${new Date().toLocaleDateString()}`
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: sessionName,
      messages: [...messages],
      createdAt: new Date(),
    }

    setChatSessions((prev) => [...prev, newSession])
    setCurrentSessionId(newSession.id)
  }

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages)
    setCurrentSessionId(session.id)
  }

  const exportChat = () => {
    const chatData = {
      sessions: chatSessions,
      currentMessages: messages,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importChat = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        if (importedData.sessions) {
          setChatSessions(importedData.sessions)
        }
        if (importedData.currentMessages) {
          setMessages(importedData.currentMessages)
        }
      } catch (error) {
        alert("Error importing chat data. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  const newChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your learning assistant. How can I help you today? You can also paste video links in the video player section and I'll help you understand the content!",
        sender: "bot",
        timestamp: new Date(),
      },
    ])
    setCurrentSessionId(null)
    setCurrentVideo(null)
    setVideoUrl("")
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Learning Assistant</h1>
              <p className="text-purple-200">Get instant help with your learning journey and video content analysis</p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={newChat} className="btn-primary flex items-center space-x-2">
                <i data-feather="plus" className="w-4 h-4"></i>
                <span>New Chat</span>
              </button>
              <button onClick={saveCurrentSession} className="btn-secondary flex items-center space-x-2">
                <i data-feather="save" className="w-4 h-4"></i>
                <span>Save</span>
              </button>
              <button onClick={exportChat} className="btn-secondary flex items-center space-x-2">
                <i data-feather="download" className="w-4 h-4"></i>
                <span>Export</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary flex items-center space-x-2"
              >
                <i data-feather="upload" className="w-4 h-4"></i>
                <span>Import</span>
              </button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={importChat} className="hidden" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Chat Sessions Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Chat History</h3>
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => loadSession(session)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      currentSessionId === session.id
                        ? "bg-purple-500/30 border border-purple-400/50"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-white font-medium text-sm truncate">{session.name}</div>
                    <div className="text-purple-200 text-xs">{session.createdAt.toLocaleDateString()}</div>
                  </button>
                ))}
                {chatSessions.length === 0 && (
                  <p className="text-purple-200 text-sm text-center py-4">No saved chats yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Video Player Block */}
          <div className="lg:col-span-2">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <i data-feather="play-circle" className="w-5 h-5 mr-2"></i>
                  Video Player
                </h3>
              </div>

              {/* Video URL Input */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube or Vimeo URL here..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-200 focus:outline-none focus:border-purple-400 text-sm"
                  />
                  <button
                    onClick={handleLoadVideo}
                    disabled={!videoUrl.trim()}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Load
                  </button>
                </div>
              </div>

              {/* Video Player */}
              {currentVideo ? (
                <div>
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    <iframe
                      src={getVideoEmbedUrl(currentVideo.platform, currentVideo.videoId)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentVideo.title}
                    ></iframe>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 mb-4">
                    <h4 className="text-white font-medium text-sm mb-1">{currentVideo.title}</h4>
                    <p className="text-purple-200 text-xs flex items-center">
                      <i data-feather="link" className="w-3 h-3 mr-1"></i>
                      {currentVideo.platform === "youtube" ? "YouTube" : "Vimeo"}
                    </p>
                  </div>

                  {/* Quick AI Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInputText("Can you provide a summary of the key points from this video?")}
                      className="btn-secondary text-xs py-2 flex items-center justify-center space-x-1"
                    >
                      <i data-feather="file-text" className="w-3 h-3"></i>
                      <span>Summary</span>
                    </button>

                    <button
                      onClick={() => setInputText("Can you create study notes from this video content?")}
                      className="btn-secondary text-xs py-2 flex items-center justify-center space-x-1"
                    >
                      <i data-feather="edit-3" className="w-3 h-3"></i>
                      <span>Notes</span>
                    </button>

                    <button
                      onClick={() => setInputText("Can you generate practice questions based on this video?")}
                      className="btn-secondary text-xs py-2 flex items-center justify-center space-x-1"
                    >
                      <i data-feather="help-circle" className="w-3 h-3"></i>
                      <span>Questions</span>
                    </button>

                    <button
                      onClick={() => setInputText("Can you explain the main concepts from this video?")}
                      className="btn-secondary text-xs py-2 flex items-center justify-center space-x-1"
                    >
                      <i data-feather="lightbulb" className="w-3 h-3"></i>
                      <span>Explain</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <i data-feather="video" className="w-12 h-12 text-purple-300 mx-auto mb-2"></i>
                    <p className="text-purple-200 text-sm">Paste a video URL above to start watching</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="glass-card p-6 h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        message.sender === "user"
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-white border border-white/20"
                      } rounded-lg overflow-hidden`}
                    >
                      <div className="px-4 py-2">
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area with Voice Support */}
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything about the video or your learning..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:border-purple-400"
                />

                {/* Voice Input Button */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`px-4 py-3 rounded-lg transition-all ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : "bg-white/10 hover:bg-white/20 text-purple-200 border border-white/20"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  <i data-feather={isListening ? "mic-off" : "mic"} className="w-4 h-4"></i>
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i data-feather="send" className="w-4 h-4"></i>
                </button>
              </div>

              {/* Voice Status Indicator */}
              {isListening && (
                <div className="mt-2 text-center">
                  <p className="text-red-400 text-sm flex items-center justify-center">
                    <i data-feather="mic" className="w-3 h-3 mr-1 animate-pulse"></i>
                    Listening... Speak now
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
