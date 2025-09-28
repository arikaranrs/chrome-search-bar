"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Server, Video, Brain, Wifi, Play } from "lucide-react"
import { apiClient, type HealthResponse } from "@/lib/api-client"
import { cn } from "@/lib/utils"

interface SystemStatusProps {
  className?: string
}

export function SystemStatus({ className }: SystemStatusProps) {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const isPreviewMode = apiClient.isInPreviewMode()

  const checkSystemHealth = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const healthData = await apiClient.checkHealth()
      setHealth(healthData)
      setLastChecked(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check system health")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSystemHealth()

    if (!isPreviewMode) {
      const interval = setInterval(checkSystemHealth, 30000)
      return () => clearInterval(interval)
    }
  }, [isPreviewMode])

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "gemini":
        return <Brain className="w-4 h-4" />
      case "livekit":
        return <Wifi className="w-4 h-4" />
      case "opencv":
        return <Video className="w-4 h-4" />
      case "ml_models":
        return <Server className="w-4 h-4" />
      default:
        return <Server className="w-4 h-4" />
    }
  }

  const getServiceName = (service: string) => {
    switch (service) {
      case "gemini":
        return "Google Gemini AI"
      case "livekit":
        return "LiveKit Audio"
      case "opencv":
        return "Computer Vision"
      case "ml_models":
        return "ML Models"
      default:
        return service
    }
  }

  const getServiceStatus = (service: string, status: boolean) => {
    if (isPreviewMode) {
      return service === "gemini" ? "Demo" : "Simulated"
    }
    return status ? "Online" : "Offline"
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {isPreviewMode ? <Play className="w-4 h-4" /> : <Server className="w-4 h-4" />}
            {isPreviewMode ? "Demo Status" : "System Status"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={checkSystemHealth} disabled={isLoading}>
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && !isPreviewMode ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="outline" size="sm" onClick={checkSystemHealth} className="mt-2 bg-transparent">
              Retry
            </Button>
          </div>
        ) : health ? (
          <>
            {/* Overall Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{isPreviewMode ? "Demo Mode" : "Backend"}</span>
              <Badge
                variant={health.status === "healthy" ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                <div
                  className={cn("w-2 h-2 rounded-full", health.status === "healthy" ? "bg-green-500" : "bg-red-500")}
                />
                {isPreviewMode ? "Active" : health.status}
              </Badge>
            </div>

            {/* Individual Services */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {isPreviewMode ? "Demo Features" : "Services"}
              </h4>
              {Object.entries(health.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getServiceIcon(service)}
                    <span className="text-sm">{getServiceName(service)}</span>
                  </div>
                  <Badge variant={status ? "default" : "destructive"} className="text-xs">
                    {getServiceStatus(service, status)}
                  </Badge>
                </div>
              ))}
            </div>

            {isPreviewMode && (
              <div className="text-xs text-blue-600 dark:text-blue-400 text-center pt-2 border-t border-blue-200 dark:border-blue-800">
                Running in preview mode with simulated responses
              </div>
            )}

            {/* Last Checked */}
            {lastChecked && !isPreviewMode && (
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {isPreviewMode ? "Loading demo..." : "Checking system status..."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
