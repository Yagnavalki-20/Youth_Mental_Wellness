import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const affirmations = [
  "You are worthy of love and respect, exactly as you are.",
  "Your feelings are valid, and it's okay to experience them.",
  "Every small step forward is progress worth celebrating.",
  "You have survived 100% of your difficult days so far.",
  "Your mental health matters, and taking care of it is brave.",
  "You are not alone in your struggles - support is available.",
  "Growth happens at your own pace, and that's perfectly okay.",
  "Your story isn't over yet - there are beautiful chapters ahead.",
  "You are resilient and have the strength to overcome challenges.",
  "It's okay to not be okay - healing is not linear.",
  "You deserve patience and compassion, especially from yourself.",
  "Your worth is not determined by your productivity or achievements.",
];

export default function DailyAffirmation() {
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Set initial affirmation based on date for consistency
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("affirmationDate");
    const storedAffirmation = localStorage.getItem("dailyAffirmation");

    if (storedDate === today && storedAffirmation) {
      setCurrentAffirmation(storedAffirmation);
    } else {
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      const newAffirmation = affirmations[randomIndex];
      setCurrentAffirmation(newAffirmation);
      localStorage.setItem("affirmationDate", today);
      localStorage.setItem("dailyAffirmation", newAffirmation);
    }
  }, []);

  const getNewAffirmation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      const newAffirmation = affirmations[randomIndex];
      setCurrentAffirmation(newAffirmation);
      localStorage.setItem("dailyAffirmation", newAffirmation);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-indigo-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Daily Affirmation
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={getNewAffirmation}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100"
          >
            <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          key={currentAffirmation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <blockquote className="text-lg font-medium text-indigo-800 leading-relaxed mb-4">
            "{currentAffirmation}"
          </blockquote>
          
          <div className="text-sm text-indigo-600 bg-white/60 rounded-full px-3 py-1 inline-block">
            Take a moment to let this sink in 💜
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}