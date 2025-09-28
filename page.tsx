"use client"

import { VoiceAssistant } from "@/components/voice-assistant"
import { SystemStatus } from "@/components/system-status"
import { PreviewModeBanner } from "@/components/preview-mode-banner"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Meet KIRA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Your Advanced AI Voice Assistant powered by Google Gemini, LiveKit, and cutting-edge ML/DL technologies
          </p>

          <PreviewModeBanner />

          <div className="flex justify-center mb-8">
            <SystemStatus />
          </div>
        </div>

        <VoiceAssistant />
      </div>
    </main>
  )
}
