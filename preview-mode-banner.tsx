"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, X, ExternalLink, Play } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export function PreviewModeBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const isPreviewMode = apiClient.isInPreviewMode()

  if (!isPreviewMode || !isVisible) {
    return null
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Play className="w-3 h-3 mr-1" />
                Preview Mode
              </Badge>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">KIRA Voice Assistant Demo</h3>
            </div>

            <p className="text-sm text-blue-700 dark:text-blue-300">
              You're viewing a demo version of KIRA. The AI responses are simulated, but you can still test the
              interface, 3D avatar, and text chat functionality.
            </p>

            <div className="flex flex-wrap gap-2 text-xs text-blue-600 dark:text-blue-400">
              <span>✅ Text Chat</span>
              <span>✅ 3D Avatar</span>
              <span>✅ UI Interactions</span>
              <span>⚠️ Voice Recognition (Browser Dependent)</span>
              <span>⚠️ LiveKit Audio (Requires Backend)</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-700 border-blue-300 hover:bg-blue-100 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-900 bg-transparent"
                onClick={() => window.open("https://github.com/your-repo/kira-voice-assistant", "_blank")}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Full Setup
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
              >
                <X className="w-3 h-3 mr-1" />
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
