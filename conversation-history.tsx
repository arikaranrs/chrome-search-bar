"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  confidence?: number
}

interface ConversationHistoryProps {
  messages: Message[]
}

export function ConversationHistory({ messages }: ConversationHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) return null

  return (
    <Card className="max-h-64 overflow-hidden">
      <CardContent className="p-0">
        <div ref={scrollRef} className="max-h-64 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3 max-w-[80%]", message.isUser ? "ml-auto flex-row-reverse" : "mr-auto")}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.isUser ? "bg-blue-500 text-white" : "bg-purple-500 text-white",
                )}
              >
                {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  message.isUser ? "bg-blue-500 text-white rounded-br-sm" : "bg-muted rounded-bl-sm",
                )}
              >
                <p>{message.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                  {message.confidence && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(message.confidence * 100)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
