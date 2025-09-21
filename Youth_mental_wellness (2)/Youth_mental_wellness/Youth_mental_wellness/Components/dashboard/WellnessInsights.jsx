import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";

export default function WellnessInsights({ moodEntries, isLoading }) {
  const calculateInsights = () => {
    if (moodEntries.length < 2) return null;

    const recent7 = moodEntries.slice(0, 7);
    const previous7 = moodEntries.slice(7, 14);

    const recentAvg = recent7.reduce((sum, entry) => sum + entry.mood_rating, 0) / recent7.length;
    const previousAvg = previous7.length > 0 
      ? previous7.reduce((sum, entry) => sum + entry.mood_rating, 0) / previous7.length
      : recentAvg;

    const trend = recentAvg - previousAvg;
    const overallAvg = moodEntries.reduce((sum, entry) => sum + entry.mood_rating, 0) / moodEntries.length;

    return {
      recentAvg: recentAvg.toFixed(1),
      trend,
      overallAvg: overallAvg.toFixed(1),
      totalEntries: moodEntries.length
    };
  };

  const insights = calculateInsights();

  const getTrendIcon = (trend) => {
    if (trend > 0.5) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < -0.5) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-yellow-600" />;
  };

  const getTrendText = (trend) => {
    if (trend > 0.5) return { text: "Improving", color: "text-green-600" };
    if (trend < -0.5) return { text: "Needs attention", color: "text-red-600" };
    return { text: "Steady", color: "text-yellow-600" };
  };

  if (isLoading || !insights) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Wellness Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">
              Track your mood for a few days to see insights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const trendInfo = getTrendText(insights.trend);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Wellness Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Recent Average</p>
            <p className="text-2xl font-bold text-blue-800">{insights.recentAvg}</p>
            <p className="text-xs text-blue-500">Last 7 entries</p>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Overall</p>
            <p className="text-2xl font-bold text-purple-800">{insights.overallAvg}</p>
            <p className="text-xs text-purple-500">{insights.totalEntries} total entries</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-lg">
          {getTrendIcon(insights.trend)}
          <span className={`font-medium ${trendInfo.color}`}>
            {trendInfo.text}
          </span>
        </div>

        <div className="text-xs text-slate-500 text-center">
          Keep tracking your mood to spot patterns and celebrate progress! 🌟
        </div>
      </CardContent>
    </Card>
  );
}