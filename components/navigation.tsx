"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Navigation() {
  const pathname = usePathname()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    // Initialize Feather icons when component mounts
    if (typeof window !== "undefined" && window.feather) {
      window.feather.replace()
    }
  }, [])

  const navItems = [
    { href: "/", label: "Dashboard", icon: "grid" },
    { href: "/courses", label: "Courses", icon: "book" },
    { href: "/progress", label: "Progress", icon: "trending-up" },
    { href: "/achievements", label: "Achievements", icon: "award" },
    { href: "/chat", label: "Chat", icon: "message-circle" },
  ]

  const handleLogout = () => {
    // Add your logout logic here (clear tokens, redirect, etc.)
    console.log("User logged out")
    setIsProfileOpen(false)
    // Example: redirect to login page
    // window.location.href = '/login'
  }

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
              <i data-feather="book-open" className="w-5 h-5 text-white"></i>
            </div>
            <h1 className="text-xl font-bold text-white">Top Journey</h1>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? "active" : ""}`}>
                <i data-feather={item.icon} className="w-4 h-4"></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-purple-200 hover:text-white transition-colors">
              <i data-feather="bell" className="w-5 h-5"></i>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center hover:ring-2 hover:ring-white/20 transition-all"
              >
                <span className="text-white text-sm font-medium">AJ</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-card border border-white/20 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">AJ</span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Alex Johnson</p>
                        <p className="text-purple-200 text-xs">alex@example.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2">
                      <i data-feather="user" className="w-4 h-4"></i>
                      <span className="text-sm">Profile Settings</span>
                    </button>

                    <button className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2">
                      <i data-feather="settings" className="w-4 h-4"></i>
                      <span className="text-sm">Preferences</span>
                    </button>

                    <div className="border-t border-white/10 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <i data-feather="log-out" className="w-4 h-4"></i>
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>}
    </nav>
  )
}
