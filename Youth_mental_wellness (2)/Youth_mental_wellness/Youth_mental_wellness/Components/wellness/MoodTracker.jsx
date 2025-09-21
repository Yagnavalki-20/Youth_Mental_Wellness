import React, { useState, useEffect } from "react";
import { MoodEntry } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Smile, 
  Meh, 
  Frown,
  Heart,
  Calendar,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

const moodOptions = [
  { value: 1, icon: Frown, label: "Very Sad", color: "bg-red-500" },
  { value: 2, icon: Frown, label: "Sad", color: "bg-red-400" },
  { value: 3, icon: Frown, label: "Down", color: "bg-orange-400" },
  { value: 4, icon: Meh, label: "Low", color: "bg-yellow-400" },
  { value: 5, icon: Meh, label: "Okay", color: "bg-yellow-500" },
  { value: 6, icon: Meh, label: "Fine", color: "bg-lime-400" },
  { value: 7, icon: Smile, label: "Good", color: "bg-green-400" },
  { value: 8, icon: Smile, label: "Happy", color: "bg-green-500" },
  { value: 9, icon: Smile, label: "Great", color: "bg-blue-400" },
  { value: 10, icon: Smile, label: "Amazing", color: "bg-blue-500" },
];

const emotionOptions = [
  "Happy", "Sad", "Anxious", "Calm", "Excited", "Worried", 
  "Grateful", "Frustrated", "Hopeful", "Lonely", "Confident", "Overwhelmed"
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [journalEntry, setJournalEntry] = useState("");
  const [recentEntries, setRecentEntries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRecentEntries();
  }, []);

  const loadRecentEntries = async () => {
    try {
      const entries = await MoodEntry.list("-created_date", 7);
      setRecentEntries(entries);
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  };

  const handleEmotionToggle = (emotion) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    try {
      await MoodEntry.create({
        mood_rating: selectedMood,
        emotions: selectedEmotions,
        journal_entry: journalEntry,
        triggers: [],
        coping_strategies_used: []
      });
      
      // Reset form
      setSelectedMood(null);
      setSelectedEmotions([]);
      setJournalEntry("");
      
      // Reload entries
      loadRecentEntries();
    } catch (error) {
      console.error("Error saving mood entry:", error);
    }
    setIsSubmitting(false);
  };

  const getMoodEmoji = (rating) => {
    const mood = moodOptions.find(m => m.value === rating);
    return mood ? { icon: mood.icon, color: mood.color, label: mood.label } : null;
  };

  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-800">
            <Heart className="w-5 h-5 text-pink-600" />
            How are you feeling right now?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {moodOptions.map((mood) => {
              const IconComponent = mood.icon;
              return (
                <motion.button
                  key={mood.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    selectedMood === mood.value
                      ? "border-pink-400 bg-pink-50 shadow-md"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <IconComponent 
                    className={`w-8 h-8 mx-auto mb-2 ${
                      selectedMood === mood.value ? "text-pink-600" : "text-slate-400"
                    }`}
                  />
                  <p className="text-xs font-medium text-slate-700">{mood.label}</p>
                  <p className="text-xs text-slate-500">{mood.value}/10</p>
                </motion.button>
              );
            })}
          </div>

          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              {/* Emotions */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">
                  What emotions are you experiencing?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {emotionOptions.map((emotion) => (
                    <Badge
                      key={emotion}
                      variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedEmotions.includes(emotion)
                          ? "bg-pink-500 hover:bg-pink-600"
                          : "hover:bg-pink-50 hover:border-pink-300"
                      }`}
                      onClick={() => handleEmotionToggle(emotion)}
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Journal */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What's on your mind? (Optional)
                </label>
                <Textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Share your thoughts, feelings, or what happened today..."
                  className="h-24 border-slate-200 focus:border-pink-400 focus:ring-pink-400"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              >
                {isSubmitting ? "Saving..." : "Save Mood Entry"}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Calendar className="w-5 h-5 text-blue-600" />
              Recent Mood Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.map((entry, index) => {
                const moodInfo = getMoodEmoji(entry.mood_rating);
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${moodInfo?.color}`}>
                      {moodInfo && <moodInfo.icon className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-800">
                          {moodInfo?.label} ({entry.mood_rating}/10)
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(entry.created_date).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.emotions && entry.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {entry.emotions.map((emotion, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {entry.journal_entry && (
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {entry.journal_entry}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}