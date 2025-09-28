import { dashboardData, getCategoryIcon, getCategoryColor } from "@/lib/data"

export default function Courses() {
  return (
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-white mb-8">Your Courses</h2>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardData.courses.map((course, index) => (
          <div key={index} className="course-card" data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="p-6">
              <div
                className={`w-12 h-12 ${getCategoryColor(course.category)} rounded-lg flex items-center justify-center mb-4`}
              >
                <i data-feather={getCategoryIcon(course.category)} className="w-6 h-6 text-blue-400"></i>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{course.title}</h4>
              <p className="text-purple-200 text-sm mb-4">{course.category}</p>
              <div className="progress-bar mb-3">
                <div
                  className={`progress-fill ${course.progress >= 80 ? "high" : course.progress >= 50 ? "medium" : "low"}`}
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-300">
                  {course.completedLessons}/{course.totalLessons} lessons • {course.progress}%
                </span>
                <button className="btn-secondary">Continue</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Courses */}
      <div className="mb-8" data-aos="fade-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <i data-feather="star" className="w-5 h-5 mr-2 text-yellow-400"></i>
          Recommended for You
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.recommendedCourses.map((course, index) => (
            <div key={index} className="course-card" data-aos="fade-up" data-aos-delay={(index + 4) * 100}>
              <div className="p-6">
                <div
                  className={`w-12 h-12 ${getCategoryColor(course.category)} rounded-lg flex items-center justify-center mb-4`}
                >
                  <i data-feather={getCategoryIcon(course.category)} className="w-6 h-6 text-blue-400"></i>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{course.title}</h4>
                <p className="text-purple-200 text-sm mb-4">{course.category}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-purple-300">
                    <div>
                      ⭐ {course.rating} • {course.students.toLocaleString()} students
                    </div>
                  </div>
                  <button className="btn-secondary">Start</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
