import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { 
  Smile, 
  Meh, 
  Frown,
  Heart,
  CheckCircle2,
  Loader2
} from "lucide-react";

const moodOptions = [
  { value: 1, icon: Frown, label: "Very Low", color: "text-red-500", bgColor: "bg-red-50 hover:bg-red-100" },
  { value: 3, icon: Frown, label: "Low", color: "text-orange-500", bgColor: "bg-orange-50 hover:bg-orange-100" },
  { value: 5, icon: Meh, label: "Okay", color: "text-yellow-500", bgColor: "bg-yellow-50 hover:bg-yellow-100" },
  { value: 7, icon: Smile, label: "Good", color: "text-green-500", bgColor: "bg-green-50 hover:bg-green-100" },
  { value: 10, icon: Smile, label: "Great", color: "text-blue-500", bgColor: "bg-blue-50 hover:bg-blue-100" },
];

export default function QuickMoodCheck({ onSubmit, todaysMood, isLoading }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        mood_rating: selectedMood,
        journal_entry: notes,
        emotions: [],
        triggers: [],
        coping_strategies_used: []
      });
      setSelectedMood(null);
      setNotes("");
    } catch (error) {
      console.error("Error submitting mood:", error);
    }
    setIsSubmitting(false);
  };

  if (todaysMood && !isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Mood Check Complete!
          </h3>
          <p className="text-green-600">
            You rated your mood as {todaysMood.mood_rating}/10 today. 
            Come back tomorrow for another check-in.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Heart className="w-5 h-5 text-pink-500" />
          How are you feeling today?
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
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMood === mood.value
                    ? `border-current ${mood.color} ${mood.bgColor} shadow-md`
                    : `border-slate-200 hover:border-slate-300 ${mood.bgColor}`
                }`}
              >
                <IconComponent 
                  className={`w-8 h-8 mx-auto mb-2 ${mood.color}`}
                />
                <p className={`text-sm font-medium ${
                  selectedMood === mood.value ? mood.color : 'text-slate-600'
                }`}>
                  {mood.label}
                </p>
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Want to share more? (Optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's contributing to how you feel today?"
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Log My Mood
                </>
              )}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}