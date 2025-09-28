"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { VoiceVisualizer } from "./voice-visualizer"
import { ConversationHistory } from "./conversation-history"
import { useVoiceAssistant } from "@/hooks/use-voice-assistant"
import { AdvancedKiraAvatar } from "./advanced-kira-avatar"
import { EmotionDetector } from "./emotion-detector"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  confidence?: number
}

export function VoiceAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [currentResponse, setCurrentResponse] = useState("")
  const [audioLevel, setAudioLevel] = useState(0)
  const [currentEmotion, setCurrentEmotion] = useState<"neutral" | "happy" | "thinking" | "speaking">("neutral")

  const { startListening, stopListening, sendMessage, connectToLiveKit, isProcessing, connectionStatus, error } =
    useVoiceAssistant()

  // Initialize voice assistant on mount
  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        await connectToLiveKit()
        setIsConnected(true)

        // Add welcome message
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: "Hello! I'm KIRA, your AI voice assistant. Say 'Hey KIRA' or click the microphone to start our conversation.",
          isUser: false,
          timestamp: new Date(),
          confidence: 1.0,
        }
        setMessages([welcomeMessage])
      } catch (error) {
        console.error("Failed to initialize assistant:", error)
      }
    }

    initializeAssistant()
  }, [connectToLiveKit])

  const handleMicClick = useCallback(async () => {
    if (isMuted) return

    if (isListening) {
      await stopListening()
      setIsListening(false)
    } else {
      await startListening()
      setIsListening(true)
    }
  }, [isListening, isMuted, startListening, stopListening])

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setCurrentResponse("Thinking...")

    try {
      const response = await sendMessage(inputText)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        confidence: response.confidence,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setCurrentResponse("")
    } catch (error) {
      console.error("Failed to send message:", error)
      setCurrentResponse("Sorry, I encountered an error. Please try again.")
    }
  }, [inputText, sendMessage])

  const handlePresetCommand = useCallback(
    (command: string) => {
      setInputText(command)
      setTimeout(() => handleSendMessage(), 100)
    },
    [handleSendMessage],
  )

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted)
    if (!isMuted && isListening) {
      stopListening()
      setIsListening(false)
    }
  }, [isMuted, isListening, stopListening])

  const presetCommands = [
    "Hello KIRA",
    "What can you do?",
    "Explain machine learning",
    "What is deep learning?",
    "Show me computer vision",
    "Help with Python coding",
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500 animate-pulse" : "bg-red-500")} />
              {connectionStatus || (isConnected ? "Connected" : "Disconnected")}
            </Badge>

            <Badge variant={isListening ? "secondary" : "outline"} className="flex items-center gap-2">
              <Mic className="w-3 h-3" />
              {isListening ? "Listening..." : "Ready"}
            </Badge>
          </div>

          <CardTitle className="text-2xl font-bold text-center mb-2">KIRA Voice Assistant</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Enhanced 3D Avatar Section */}
          <div className="flex justify-center">
            <AdvancedKiraAvatar
              isListening={isListening}
              isSpeaking={isProcessing}
              audioLevel={audioLevel}
              currentEmotion={currentEmotion}
            />
          </div>

          {/* Emotion Detection */}
          <div className="flex justify-center">
            <EmotionDetector
              currentMessage={messages.length > 0 ? messages[messages.length - 1]?.text : ""}
              isListening={isListening}
              isSpeaking={isProcessing}
              onEmotionChange={(emotion) => setCurrentEmotion(emotion.primary as any)}
            />
          </div>

          {/* Voice Visualizer */}
          <VoiceVisualizer isActive={isListening || isProcessing} audioLevel={audioLevel} />

          {/* Current Response Display */}
          <Card className="min-h-[80px] bg-muted/50">
            <CardContent className="p-4">
              <div className="text-center">
                {currentResponse ||
                  (messages.length > 0 ? messages[messages.length - 1]?.text : "Say 'Hey KIRA' to activate!")}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={handleMicClick}
              disabled={isMuted}
              size="lg"
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                isListening && "bg-red-500 hover:bg-red-600 animate-pulse",
              )}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isListening ? "Stop" : "Speak"}
            </Button>

            <Button onClick={toggleMute} variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              {isMuted ? "Unmute" : "Mute"}
            </Button>
          </div>

          {/* Text Input */}
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message or use voice..."
              className="flex-1"
              disabled={isProcessing}
            />
            <Button onClick={handleSendMessage} disabled={!inputText.trim() || isProcessing} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Preset Commands */}
          <div className="flex flex-wrap gap-2 justify-center">
            {presetCommands.map((command, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handlePresetCommand(command)}
                className="text-xs"
              >
                {command}
              </Button>
            ))}
          </div>

          {/* Conversation History */}
          <ConversationHistory messages={messages} />

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">Error: {error}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
