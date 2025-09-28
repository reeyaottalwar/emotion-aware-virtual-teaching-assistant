"use client"

import { useEffect } from "react"

export default function ClientScripts() {
  useEffect(() => {
    // Initialize Vanta.js background
    const initVanta = () => {
      const vantaBg = document.getElementById("vanta-bg")

      if (vantaBg && window.VANTA && window.VANTA.GLOBE) {
        try {
          window.VANTA.GLOBE({
            el: vantaBg,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 0.8,
            color: 0x667eea,
            color2: 0x764ba2,
            backgroundColor: 0x1a1a2e,
            size: 1.2,
            opacity: 0.7,
          })
        } catch (error) {
          console.warn("Failed to initialize Vanta background:", error)
          if (vantaBg) {
            vantaBg.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          }
        }
      }
    }

    // Initialize AOS animations
    const initAOS = () => {
      if (window.AOS) {
        window.AOS.init({
          duration: 800,
          easing: "ease-in-out",
          once: true,
          offset: 100,
        })
      }
    }

    // Initialize Feather icons
    const initFeather = () => {
      if (window.feather) {
        window.feather.replace()
      }
    }

    // Wait for scripts to load
    const checkAndInit = () => {
      initFeather()
      initAOS()
      setTimeout(initVanta, 500)
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", checkAndInit)
    } else {
      checkAndInit()
    }

    return () => {
      document.removeEventListener("DOMContentLoaded", checkAndInit)
    }
  }, [])

  return null
}
