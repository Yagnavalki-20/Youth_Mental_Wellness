import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart,
  BookOpen,
  BarChart3,
  Wind,
  Timer,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

import MoodTracker from "../components/wellness/MoodTracker";
import Journal from "../components/wellness/Journal";
import BreathingExercise from "../components/wellness/BreathingExercise";
import MindfulnessTimer from "../components/wellness/MindfulnessTimer";

export default function Wellness() {
  const [activeTab, setActiveTab] = useState("mood");

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Wellness Tools
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Take care of your mental health with these gentle, evidence-based tools. 
            Remember to be patient and kind with yourself.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-white shadow-lg border-0 p-1">
              <TabsTrigger 
                value="mood" 
                className="flex items-center gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-white"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Mood</span>
              </TabsTrigger>
              <TabsTrigger 
                value="journal"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Journal</span>
              </TabsTrigger>
              <TabsTrigger 
                value="breathing"
                className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Wind className="w-4 h-4" />
                <span className="hidden sm:inline">Breathe</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mindfulness"
                className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                <Timer className="w-4 h-4" />
                <span className="hidden sm:inline">Focus</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="mood" className="space-y-6">
            <MoodTracker />
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <Journal />
          </TabsContent>

          <TabsContent value="breathing" className="space-y-6">
            <BreathingExercise />
          </TabsContent>

          <TabsContent value="mindfulness" className="space-y-6">
            <MindfulnessTimer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}