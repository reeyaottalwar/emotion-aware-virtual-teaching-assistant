"use client"

import { useEffect, useRef } from "react"

export default function Progress() {
  const detailedChartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.Chart && detailedChartRef.current) {
      const ctx = detailedChartRef.current

      new window.Chart(ctx, {
        type: "radar",
        data: {
          labels: ["JavaScript", "Python", "UI/UX", "Machine Learning", "Data Science"],
          datasets: [
            {
              label: "Skill Level",
              data: [85, 60, 95, 35, 70],
              backgroundColor: "rgba(31, 184, 205, 0.2)",
              borderColor: "#1FB8CD",
              borderWidth: 2,
              pointBackgroundColor: "#1FB8CD",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#1FB8CD",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              angleLines: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              pointLabels: {
                color: "rgba(255, 255, 255, 0.8)",
                font: {
                  size: 11,
                },
              },
              ticks: {
                color: "rgba(255, 255, 255, 0.6)",
                backdropColor: "transparent",
                font: {
                  size: 10,
                },
              },
            },
          },
        },
      })
    }
  }, [])

  const skills = [
    { name: "JavaScript", progress: 85, category: "Programming" },
    { name: "Python", progress: 60, category: "Data Science" },
    { name: "UI/UX Design", progress: 95, category: "Design" },
    { name: "Machine Learning", progress: 35, category: "AI/ML" },
  ]

  return (
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-white mb-8">Learning Progress</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Detailed Progress Chart */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Course Progress</h3>
          <div className="chart-container" style={{ position: "relative", height: "400px" }}>
            <canvas ref={detailedChartRef}></canvas>
          </div>
        </div>

        {/* Skills Progress */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Skill Development</h3>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className="text-sm text-purple-200">{skill.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${skill.progress >= 80 ? "high" : skill.progress >= 50 ? "medium" : "low"}`}
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-purple-300">{skill.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
