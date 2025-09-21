import React, { useState, useEffect } from "react";
import { MoodEntry, ChatSession } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Heart, 
  MessageCircle, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Smile,
  Meh,
  Frown,
  Sun,
  Cloud,
  CloudRain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import QuickMoodCheck from "../components/dashboard/QuickMoodCheck";
import RecentActivity from "../components/dashboard/RecentActivity";
import WellnessInsights from "../components/dashboard/WellnessInsights";
import DailyAffirmation from "../components/dashboard/DailyAffirmation";
import StreakDisplay from "../components/gamification/StreakDisplay";
import AchievementBadges from "../components/gamification/AchievementBadges";
import PersonalizedGoals from "../components/personalization/PersonalizedGoals";
import OfflineIndicator from "../components/mobile/OfflineIndicator";

export default function Dashboard() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todaysMood, setTodaysMood] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const [moods, chats] = await Promise.all([
        MoodEntry.list("-created_date", 30),
        ChatSession.list("-created_date", 10)
      ]);
      
      setMoodEntries(moods);
      setChatSessions(chats);
      
      // Check if user has logged mood today
      const today = new Date().toDateString();
      const todayEntry = moods.find(entry => 
        new Date(entry.created_date).toDateString() === today
      );
      setTodaysMood(todayEntry);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleMoodSubmit = async (moodData) => {
    try {
      await MoodEntry.create(moodData);
      loadUserData();
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Offline/Connection Status */}
        <OfflineIndicator />

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Welcome to Your Safe Space
          </h1>
          <p className="text-lg text-slate-600">
            How are you feeling today? Remember, it's okay to not be okay.
          </p>
        </motion.div>

        {/* Quick Actions Row */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link to={createPageUrl("Chat")}>
              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Talk to AI Counselor</h3>
                  <p className="text-blue-600">Get immediate, judgment-free support anytime</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to={createPageUrl("Wellness")}>
              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-pink-800 mb-2">Wellness Tools</h3>
                  <p className="text-pink-600">Track moods, journal, and practice mindfulness</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link to={createPageUrl("Resources")}>
              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">Learn & Grow</h3>
                  <p className="text-purple-600">Explore resources and coping strategies</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <QuickMoodCheck 
              onSubmit={handleMoodSubmit}
              todaysMood={todaysMood}
              isLoading={isLoading}
            />
            
            <RecentActivity 
              chatSessions={chatSessions}
              moodEntries={moodEntries}
              isLoading={isLoading}
            />

            {/* Gamification Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <StreakDisplay />
              <AchievementBadges />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DailyAffirmation />
            
            <WellnessInsights 
              moodEntries={moodEntries}
              isLoading={isLoading}
            />

            <PersonalizedGoals />
          </div>
        </div>
      </div>
    </div>
  );
}