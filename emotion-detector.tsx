"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Zap, MessageCircle } from "lucide-react"

interface EmotionState {
  primary: "neutral" | "happy" | "thinking" | "speaking" | "excited" | "focused"
  confidence: number
  context: string
}

interface EmotionDetectorProps {
  currentMessage: string
  isListening: boolean
  isSpeaking: boolean
  onEmotionChange: (emotion: EmotionState) => void
}

export function EmotionDetector({ currentMessage, isListening, isSpeaking, onEmotionChange }: EmotionDetectorProps) {
  const [emotion, setEmotion] = useState<EmotionState>({
    primary: "neutral",
    confidence: 0.8,
    context: "Ready to help",
  })

  useEffect(() => {
    let newEmotion: EmotionState

    if (isSpeaking) {
      newEmotion = {
        primary: "speaking",
        confidence: 0.9,
        context: "Responding to your question",
      }
    } else if (isListening) {
      newEmotion = {
        primary: "focused",
        confidence: 0.85,
        context: "Listening carefully",
      }
    } else if (currentMessage.toLowerCase().includes("hello") || currentMessage.toLowerCase().includes("hi")) {
      newEmotion = {
        primary: "happy",
        confidence: 0.9,
        context: "Greeting detected",
      }
    } else if (currentMessage.toLowerCase().includes("explain") || currentMessage.toLowerCase().includes("what")) {
      newEmotion = {
        primary: "thinking",
        confidence: 0.8,
        context: "Processing complex query",
      }
    } else if (currentMessage.toLowerCase().includes("amazing") || currentMessage.toLowerCase().includes("great")) {
      newEmotion = {
        primary: "excited",
        confidence: 0.85,
        context: "Positive feedback received",
      }
    } else {
      newEmotion = {
        primary: "neutral",
        confidence: 0.7,
        context: "Ready to assist",
      }
    }

    setEmotion(newEmotion)
    onEmotionChange(newEmotion)
  }, [currentMessage, isListening, isSpeaking, onEmotionChange])

  const getEmotionIcon = () => {
    switch (emotion.primary) {
      case "happy":
        return <Heart className="w-4 h-4 text-green-500" />
      case "thinking":
        return <Brain className="w-4 h-4 text-yellow-500" />
      case "speaking":
        return <MessageCircle className="w-4 h-4 text-blue-500" />
      case "excited":
        return <Zap className="w-4 h-4 text-purple-500" />
      case "focused":
        return <Brain className="w-4 h-4 text-orange-500" />
      default:
        return <Heart className="w-4 h-4 text-gray-500" />
    }
  }

  const getEmotionColor = () => {
    switch (emotion.primary) {
      case "happy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "thinking":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "speaking":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "excited":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "focused":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getEmotionIcon()}
          Emotion Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getEmotionColor()}>
            {emotion.primary.charAt(0).toUpperCase() + emotion.primary.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">{Math.round(emotion.confidence * 100)}%</span>
        </div>

        <p className="text-xs text-muted-foreground">{emotion.context}</p>

        {/* Emotion Intensity Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${emotion.confidence * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
