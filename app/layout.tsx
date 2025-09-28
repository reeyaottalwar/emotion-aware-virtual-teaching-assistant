import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import ClientScripts from "@/components/client-scripts"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Top Journey - Learning Dashboard",
  description: "Your personalized learning journey dashboard",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Vanta Background */}
        <div id="vanta-bg" className="fixed inset-0 z-0"></div>

        <Navigation />

        <main className="pt-20 pb-8 relative z-10">{children}</main>

        <ClientScripts />

        {/* External Scripts */}
        <script src="https://unpkg.com/feather-icons" async />
        <script src="https://unpkg.com/aos@next/dist/aos.js" async />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" async />
        <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js" async />
        <script src="https://cdn.jsdelivr.net/npm/chart.js" async />
        <link href="https://unpkg.com/aos@next/dist/aos.css" rel="stylesheet" />
      </body>
    </html>
  )
}
