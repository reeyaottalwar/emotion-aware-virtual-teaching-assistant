"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function Navigation() {
  const pathname = usePathname()

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
  ]

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
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AJ</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
