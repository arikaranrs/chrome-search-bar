import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import Script from "next/script"

export const metadata: Metadata = {
  title: "KIRA - AI Voice Assistant",
  description: "Advanced AI Voice Assistant powered by Google Gemini, LiveKit, and cutting-edge ML/DL technologies",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Script src="https://cdn.livekit.io/client/v2/livekit-client.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.13.0" strategy="beforeInteractive" />
        <Script
          src="https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands@0.18.0"
          strategy="beforeInteractive"
        />

        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
