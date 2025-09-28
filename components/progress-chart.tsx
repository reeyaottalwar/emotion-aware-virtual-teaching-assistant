"use client"

import { useEffect, useRef } from "react"

export default function ProgressChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.Chart && chartRef.current) {
      const ctx = chartRef.current

      new window.Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Completed", "In Progress", "Not Started"],
          datasets: [
            {
              data: [65, 25, 10],
              backgroundColor: ["#1FB8CD", "#FFC185", "#B4413C"],
              borderWidth: 0,
              cutout: "70%",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "rgba(255, 255, 255, 0.8)",
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      })
    }
  }, [])

  return (
    <div className="glass-card p-6" data-aos="fade-up" data-aos-delay="500">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <i data-feather="trending-up" className="w-5 h-5 mr-2 text-green-400"></i>
        Learning Progress
      </h3>
      <div className="chart-container" style={{ position: "relative", height: "300px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}
