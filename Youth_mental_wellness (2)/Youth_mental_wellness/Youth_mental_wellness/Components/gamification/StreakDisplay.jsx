import React, { useState, useEffect } from "react";
import { WellnessStreak } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Flame, 
  Target, 
  Calendar,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const streakIcons = {
  mood_check: { icon: "❤️", color: "text-pink-600", bg: "bg-pink-50" },
  chat_session: { icon: "💬", color: "text-blue-600", bg: "bg-blue-50" },
  mindfulness: { icon: "🧘", color: "text-purple-600", bg: "bg-purple-50" },
  journaling: { icon: "📝", color: "text-green-600", bg: "bg-green-50" },
  daily_login: { icon: "🌟", color: "text-yellow-600", bg: "bg-yellow-50" }
};

export default function StreakDisplay() {
  const [streaks, setStreaks] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStreaks();
  }, []);

  const loadStreaks = async () => {
    setIsLoading(true);
    try {
      const data = await WellnessStreak.list();
      setStreaks(data);
      
      // Calculate total points based on streaks
      const points = data.reduce((total, streak) => {
        return total + (streak.current_streak * 10) + (streak.longest_streak * 5);
      }, 0);
      setTotalPoints(points);
    } catch (error) {
      console.error("Error loading streaks:", error);
    }
    setIsLoading(false);
  };

  const getStreakEmoji = (current) => {
    if (current >= 30) return "🔥🔥🔥";
    if (current >= 14) return "🔥🔥";
    if (current >= 7) return "🔥";
    if (current >= 3) return "⭐";
    return "💪";
  };

  const getEncouragementMessage = (streak) => {
    const { current_streak, weekly_goal, weekly_count } = streak;
    
    if (current_streak >= 7) return "Amazing consistency! 🎉";
    if (current_streak >= 3) return "Great momentum! 💫";
    if (weekly_count >= weekly_goal) return "Weekly goal achieved! ✨";
    return "You've got this! 🌱";
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Wellness Streaks
          <Badge variant="outline" className="ml-auto bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border-orange-200">
            {totalPoints} points
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {streaks.length > 0 ? (
          streaks.map((streak, index) => {
            const config = streakIcons[streak.streak_type] || streakIcons.daily_login;
            const progressPercent = Math.min((streak.weekly_count / streak.weekly_goal) * 100, 100);
            
            return (
              <motion.div
                key={streak.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${config.bg} border-slate-200`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{config.icon}</div>
                    <div>
                      <h4 className="font-semibold text-slate-800 capitalize">
                        {streak.streak_type.replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {getEncouragementMessage(streak)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold">
                      {getStreakEmoji(streak.current_streak)}
                      <span className={config.color}>{streak.current_streak}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Best: {streak.longest_streak}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">This week</span>
                    <span className={`font-medium ${config.color}`}>
                      {streak.weekly_count}/{streak.weekly_goal}
                    </span>
                  </div>
                  <Progress 
                    value={progressPercent} 
                    className="h-2"
                  />
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-600 mb-2">Start Your Wellness Journey</h3>
            <p className="text-slate-500 text-sm">
              Begin tracking your mood, chat with AI, or practice mindfulness to start building streaks!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}