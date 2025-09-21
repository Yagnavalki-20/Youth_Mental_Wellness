import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Heart, Calendar } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

export default function RecentActivity({ chatSessions, moodEntries, isLoading }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

  const getMoodEmoji = (rating) => {
    if (rating <= 2) return "😢";
    if (rating <= 4) return "😕";
    if (rating <= 6) return "😐";
    if (rating <= 8) return "🙂";
    return "😊";
  };

  const recentActivities = [
    ...chatSessions.slice(0, 3).map(session => ({
      type: "chat",
      date: session.created_date,
      title: session.session_title || "Chat Session",
      subtitle: `${session.messages?.length || 0} messages exchanged`
    })),
    ...moodEntries.slice(0, 3).map(entry => ({
      type: "mood",
      date: entry.created_date,
      title: `Mood: ${getMoodEmoji(entry.mood_rating)} ${entry.mood_rating}/10`,
      subtitle: entry.journal_entry ? "With notes" : "Quick check-in"
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Calendar className="w-5 h-5 text-blue-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        ) : recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === "chat" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-pink-100 text-pink-600"
                }`}>
                  {activity.type === "chat" ? (
                    <MessageCircle className="w-5 h-5" />
                  ) : (
                    <Heart className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">
                    {activity.title}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {activity.subtitle}
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDate(activity.date)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">
              No activity yet. Start by checking in with your mood or having a chat!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}