import { dashboardData, getActivityIcon } from "@/lib/data"
import StatsGrid from "@/components/stats-grid"
import ProgressChart from "@/components/progress-chart"

export default function Dashboard() {
  return (
    <div className="container mx-auto px-6">
      {/* Welcome Banner */}
      <div className="mb-8" data-aos="fade-up">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200">Ready to continue your learning journey?</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{dashboardData.stats.learningStreak}</div>
                <div className="text-sm text-purple-200">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Goals */}
        <div className="glass-card p-6" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <i data-feather="target" className="w-5 h-5 mr-2 text-orange-400"></i>
            Daily Goals
          </h3>
          <div className="space-y-4">
            {dashboardData.goals.map((goal, index) => (
              <div key={index} className={`goal-item ${goal.completed ? "completed" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{goal.title}</span>
                  {goal.completed && <i data-feather="check-circle" className="w-4 h-4 text-green-400"></i>}
                </div>
                <div className="progress-bar mb-2">
                  <div
                    className={`progress-fill ${goal.progress >= 80 ? "high" : goal.progress >= 50 ? "medium" : "low"}`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-purple-200">
                  <span>
                    {goal.current}
                    {typeof goal.current === "number" && goal.current % 1 !== 0 ? "h" : ""} of {goal.target}
                    {typeof goal.target === "number" && goal.target % 1 !== 0 ? "h" : ""}
                  </span>
                  <span>{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Courses */}
        <div className="glass-card p-6" data-aos="fade-up" data-aos-delay="300">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <i data-feather="play-circle" className="w-5 h-5 mr-2 text-green-400"></i>
            Continue Learning
          </h3>
          <div className="space-y-3">
            {dashboardData.courses.slice(0, 3).map((course, index) => (
              <div key={index} className="course-card">
                <div className="p-4">
                  <h4 className="text-white font-semibold text-sm mb-2">{course.title}</h4>
                  <p className="text-purple-200 text-xs mb-3">{course.category}</p>
                  <div className="progress-bar mb-2">
                    <div
                      className={`progress-fill ${course.progress >= 80 ? "high" : course.progress >= 50 ? "medium" : "low"}`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-purple-200">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className="text-xs text-white font-medium">{course.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6" data-aos="fade-up" data-aos-delay="400">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <i data-feather="activity" className="w-5 h-5 mr-2 text-blue-400"></i>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {dashboardData.recentActivities.map((activity, index) => (
              <div key={index} className={`activity-item ${activity.type}`}>
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <i data-feather={getActivityIcon(activity.type)} className="w-4 h-4 text-blue-400"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">{activity.action}</p>
                    <p className="text-purple-200 text-xs">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ProgressChart />

        {/* Study Time Chart */}
        <div className="glass-card p-6" data-aos="fade-up" data-aos-delay="600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <i data-feather="clock" className="w-5 h-5 mr-2 text-purple-400"></i>
            Weekly Study Time
          </h3>
          <div className="chart-container" style={{ position: "relative", height: "300px" }}>
            <canvas id="studyTimeChart"></canvas>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8" data-aos="fade-up" data-aos-delay="700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <i data-feather="zap" className="w-5 h-5 mr-2 text-yellow-400"></i>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "play", text: "Continue JavaScript", color: "text-blue-400" },
            { icon: "search", text: "Browse Courses", color: "text-purple-400" },
            { icon: "users", text: "Join Study Group", color: "text-green-400" },
            { icon: "calendar", text: "Schedule Session", color: "text-orange-400" },
          ].map((action, index) => (
            <button key={index} className="quick-action-btn">
              <i data-feather={action.icon} className={`w-5 h-5 ${action.color}`}></i>
              <span>{action.text}</span>
              <i data-feather="arrow-right" className="w-4 h-4 ml-auto"></i>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
