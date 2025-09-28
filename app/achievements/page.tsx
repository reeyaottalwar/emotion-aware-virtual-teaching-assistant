import { dashboardData } from '@/lib/data'

export default function Achievements() {
  return (
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-white mb-8">Achievements & Badges</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {dashboardData.achievements.map((achievement, index) => (
          <div 
            key={index}
            className={`achievement-badge ${achievement.earned ? 'earned' : 'not-earned'}`}
            data-aos="fade-up" 
            data-aos-delay={index * 100}
          >
            <div className={`w-12 h-12 mx-auto mb-3 ${achievement.earned ? 'text-yellow-400' : 'text-gray-400'}`}>
              <i data-feather="award" className="w-full h-full"></i>
            </div>
            <h4 className="text-white font-semibold text-sm mb-2">{achievement.name}</h4>
            <p className="text-purple-200 text-xs">{achievement.description}</p>
            {achievement.earned ? (
              <div className="mt-2 text-xs text-yellow-400">✓ Earned</div>
            ) : (
              <div className="mt-2 text-xs text-gray-400">Not earned</div>
            )}
          </div>
        ))}
      </div>

      {/* Achievement Stats */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Achievement Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">3</div>
            <div className="text-purple-200">Badges Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">1</div>
            <div className="text-purple-200">Badges Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">75%</div>
            <div className="text-purple-200">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
