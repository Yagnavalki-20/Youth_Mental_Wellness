import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const breathingPatterns = [
  {
    name: "Box Breathing",
    description: "Equal counts for inhale, hold, exhale, hold",
    pattern: [4, 4, 4, 4],
    labels: ["Inhale", "Hold", "Exhale", "Hold"]
  },
  {
    name: "4-7-8 Technique",
    description: "Calming pattern for relaxation",
    pattern: [4, 7, 8, 0],
    labels: ["Inhale", "Hold", "Exhale", ""]
  },
  {
    name: "Simple Deep Breathing",
    description: "Basic relaxation breathing",
    pattern: [4, 0, 6, 0],
    labels: ["Inhale", "", "Exhale", ""]
  }
];

export default function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedPattern.pattern[0]);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            const nextPhase = (currentPhase + 1) % selectedPattern.pattern.length;
            setCurrentPhase(nextPhase);
            
            if (nextPhase === 0) {
              setCycles(prev => prev + 1);
            }
            
            return selectedPattern.pattern[nextPhase];
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, currentPhase, selectedPattern]);

  const startExercise = () => {
    setIsActive(true);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setTimeLeft(selectedPattern.pattern[0]);
    setCycles(0);
  };

  const selectPattern = (pattern) => {
    setSelectedPattern(pattern);
    setCurrentPhase(0);
    setTimeLeft(pattern.pattern[0]);
    setIsActive(false);
    setCycles(0);
  };

  const currentLabel = selectedPattern.labels[currentPhase];
  const progress = selectedPattern.pattern[currentPhase] > 0 
    ? ((selectedPattern.pattern[currentPhase] - timeLeft) / selectedPattern.pattern[currentPhase]) * 100 
    : 100;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Wind className="w-5 h-5 text-green-600" />
            Breathing Exercises
          </CardTitle>
          <p className="text-green-600">
            Calm your mind with guided breathing techniques
          </p>
        </CardHeader>
      </Card>

      {/* Pattern Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {breathingPatterns.map((pattern, index) => (
          <Card 
            key={index}
            className={`cursor-pointer transition-all duration-200 ${
              selectedPattern.name === pattern.name
                ? "border-green-400 bg-green-50 shadow-md"
                : "border-slate-200 hover:border-green-300"
            }`}
            onClick={() => selectPattern(pattern)}
          >
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-slate-800 mb-2">{pattern.name}</h3>
              <p className="text-sm text-slate-600 mb-3">{pattern.description}</p>
              <div className="flex justify-center gap-1 text-xs text-slate-500">
                {pattern.pattern.map((count, i) => 
                  count > 0 ? (
                    <span key={i} className="bg-green-200 px-2 py-1 rounded">
                      {count}s
                    </span>
                  ) : null
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Breathing Animation */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="max-w-md mx-auto space-y-8">
            {/* Breathing Circle */}
            <div className="relative w-48 h-48 mx-auto">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-20"
                animate={{
                  scale: currentLabel === "Inhale" ? 1.3 : 1,
                }}
                transition={{
                  duration: selectedPattern.pattern[currentPhase],
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-4 rounded-full bg-gradient-to-r from-green-500 to-blue-600 opacity-40"
                animate={{
                  scale: currentLabel === "Inhale" ? 1.2 : 1,
                }}
                transition={{
                  duration: selectedPattern.pattern[currentPhase],
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-8 rounded-full bg-gradient-to-r from-green-600 to-blue-700 opacity-80 flex items-center justify-center"
                animate={{
                  scale: currentLabel === "Inhale" ? 1.1 : 1,
                }}
                transition={{
                  duration: selectedPattern.pattern[currentPhase],
                  ease: "easeInOut"
                }}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {timeLeft}
                  </div>
                  <div className="text-white font-medium">
                    {currentLabel}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">
                {selectedPattern.name}
              </h3>
              
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentLabel}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg text-slate-600"
                >
                  {currentLabel && `${currentLabel} for ${timeLeft} seconds`}
                </motion.p>
              </AnimatePresence>

              <div className="text-sm text-slate-500">
                Cycles completed: {cycles}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={isActive ? pauseExercise : startExercise}
                className="bg-green-600 hover:bg-green-700"
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              
              <Button
                onClick={resetExercise}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}