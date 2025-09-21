import React, { useState, useEffect } from "react";
import { Achievement } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award,
  Star,
  Crown,
  Target,
  Zap,
  Heart,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const iconMap = {
  award: Award,
  star: Star,
  crown: Crown,
  target: Target,
  zap: Zap,
  heart: Heart
};

export default function AchievementBadges() {
  const [achievements, setAchievements] = useState([]);
  const [recentUnlock, setRecentUnlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setIsLoading(true);
    try {
      const data = await Achievement.list("-unlocked_date");
      setAchievements(data);
      
      // Check for recent unlocks (within last 24 hours)
      const recent = data.find(achievement => 
        achievement.is_unlocked && 
        achievement.unlocked_date &&
        new Date() - new Date(achievement.unlocked_date) < 24 * 60 * 60 * 1000
      );
      
      if (recent && !sessionStorage.getItem(`shown_${recent.id}`)) {
        setRecentUnlock(recent);
        sessionStorage.setItem(`shown_${recent.id}`, 'true');
        setTimeout(() => setRecentUnlock(null), 5000);
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
    setIsLoading(false);
  };

  const unlockedCount = achievements.filter(a => a.is_unlocked).length;
  const totalPoints = achievements
    .filter(a => a.is_unlocked)
    .reduce((sum, a) => sum + (a.points || 0), 0);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/2" />
            <div className="grid grid-cols-3 gap-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-20 bg-slate-200 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Achievement Badges
            <Badge variant="outline" className="ml-auto bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200">
              {unlockedCount}/{achievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Total Points</p>
                <p className="text-sm text-slate-600">Keep unlocking to earn more!</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {totalPoints}
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {achievements.map((achievement, index) => {
              const IconComponent = iconMap[achievement.badge_icon] || Star;
              const isUnlocked = achievement.is_unlocked;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-3 rounded-xl border-2 text-center transition-all duration-300 cursor-pointer group ${
                    isUnlocked
                      ? `${achievement.badge_color || 'border-yellow-300 bg-yellow-50 shadow-md'}`
                      : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    isUnlocked 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                      : 'bg-slate-300'
                  }`}>
                    {isUnlocked ? (
                      <IconComponent className="w-5 h-5 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  
                  <h4 className={`text-xs font-medium truncate ${
                    isUnlocked ? 'text-slate-800' : 'text-slate-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  
                  {achievement.points && (
                    <p className="text-xs text-slate-400 mt-1">
                      {achievement.points}pts
                    </p>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {achievement.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievement Unlock Notification */}
      <AnimatePresence>
        {recentUnlock && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50"
          >
            <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Achievement Unlocked!</h4>
                    <p className="text-sm text-slate-600">{recentUnlock.title}</p>
                    <p className="text-xs text-yellow-600">+{recentUnlock.points} points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}