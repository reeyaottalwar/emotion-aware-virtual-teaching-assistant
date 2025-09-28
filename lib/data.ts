// Sample data for the dashboard
export const dashboardData = {
  user: {
    name: "Alex Johnson",
    username: "alexj_learns",
    level: "Intermediate",
    joinDate: "2024-01-15",
  },
  stats: {
    learningStreak: 15,
    totalStudyHours: 87,
    coursesCompleted: 12,
    currentCourses: 4,
    overallProgress: 73,
  },
  courses: [
    {
      title: "JavaScript Mastery",
      progress: 85,
      category: "Programming",
      totalLessons: 24,
      completedLessons: 20,
    },
    {
      title: "Python for Data Science",
      progress: 60,
      category: "Data Science",
      totalLessons: 30,
      completedLessons: 18,
    },
    {
      title: "UI/UX Design Fundamentals",
      progress: 95,
      category: "Design",
      totalLessons: 20,
      completedLessons: 19,
    },
    {
      title: "Machine Learning Basics",
      progress: 35,
      category: "AI/ML",
      totalLessons: 28,
      completedLessons: 10,
    },
  ],
  goals: [
    {
      title: "Complete 3 lessons today",
      current: 2,
      target: 3,
      progress: 67,
    },
    {
      title: "Study 5 hours this week",
      current: 8.5,
      target: 5,
      progress: 100,
      completed: true,
    },
    {
      title: "Maintain 7-day streak",
      current: 15,
      target: 7,
      progress: 100,
      completed: true,
    },
  ],
  recentActivities: [
    {
      action: "Completed lesson: Advanced Functions in JavaScript",
      time: "2 hours ago",
      type: "lesson",
    },
    {
      action: "Started course: Machine Learning Basics",
      time: "1 day ago",
      type: "course",
    },
    {
      action: "Earned badge: Week Warrior",
      time: "3 days ago",
      type: "achievement",
    },
    {
      action: "Completed quiz: Python Data Types",
      time: "5 days ago",
      type: "quiz",
    },
  ],
  achievements: [
    {
      name: "Early Bird",
      description: "Study before 8 AM",
      earned: true,
    },
    {
      name: "Week Warrior",
      description: "7-day learning streak",
      earned: true,
    },
    {
      name: "Course Crusher",
      description: "Complete 10 courses",
      earned: true,
    },
    {
      name: "Speed Learner",
      description: "Finish course in 1 week",
      earned: false,
    },
  ],
  recommendedCourses: [
    {
      title: "Advanced JavaScript",
      category: "Programming",
      rating: 4.8,
      students: 15420,
    },
    {
      title: "React Development",
      category: "Web Development",
      rating: 4.9,
      students: 12650,
    },
    {
      title: "Data Visualization",
      category: "Data Science",
      rating: 4.7,
      students: 8930,
    },
  ],
}

export const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    Programming: "code",
    "Data Science": "bar-chart-2",
    Design: "palette",
    "AI/ML": "cpu",
    "Web Development": "globe",
  }
  return icons[category] || "book"
}

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Programming: "bg-blue-500/20",
    "Data Science": "bg-green-500/20",
    Design: "bg-purple-500/20",
    "AI/ML": "bg-orange-500/20",
    "Web Development": "bg-blue-500/20",
  }
  return colors[category] || "bg-gray-500/20"
}

export const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    lesson: "book-open",
    course: "play-circle",
    achievement: "award",
    quiz: "help-circle",
  }
  return icons[type] || "activity"
}
