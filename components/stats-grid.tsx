import { dashboardData } from "@/lib/data"

export default function StatsGrid() {
  const stats = [
    {
      icon: "book-open",
      value: dashboardData.stats.coursesCompleted,
      label: "Completed",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      icon: "clock",
      value: `${dashboardData.stats.totalStudyHours}h`,
      label: "Study Time",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      icon: "target",
      value: `${dashboardData.stats.overallProgress}%`,
      label: "Progress",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      icon: "flame",
      value: dashboardData.stats.learningStreak,
      label: "Day Streak",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8" data-aos="fade-up" data-aos-delay="100">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card p-4 md:p-6 text-center">
          <div
            className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}
          >
            <i data-feather={stat.icon} className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`}></i>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-xs md:text-sm text-purple-200">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
