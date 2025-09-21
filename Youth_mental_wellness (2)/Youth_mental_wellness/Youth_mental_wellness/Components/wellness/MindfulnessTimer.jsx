import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const timerPresets = [
  { label: "Quick Focus", minutes: 5 },
  { label: "Short Break", minutes: 10 },
  { label: "Deep Focus", minutes: 15 },
  { label: "Power Session", minutes: 25 },
  { label: "Long Session", minutes: 45 }
];

const mindfulnessPrompts = [
  "Focus on your breath. Notice each inhale and exhale.",
  "Observe your thoughts without judgment, like clouds passing in the sky.",
  "Feel the connection between your body and the surface you're sitting on.",
  "Listen to the sounds around you without labeling them.",
  "Notice any tension in your body and gently release it.",
  "Bring your attention to this present moment.",
  "Feel gratitude for this time you're giving yourself.",
  "Let go of any expectations and simply be.",
];

export default function MindfulnessTimer() {
  const [selectedTime, setSelectedTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentPrompt, setCurrentPrompt] = useState(mindfulnessPrompts[0]);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef(null);
  const promptIntervalRef = useRef(null);

  const completeSession = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setCompletedSessions(prev => prev + 1);
    
    if (soundEnabled && 'Notification' in window) {
      new Notification('Mindfulness session complete! 🧘‍♀️');
    }
    
    // Play completion sound (if we had audio files)
    console.log("Session completed!");
  }, [soundEnabled]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            completeSession();
            return 0;
          }
          return time - 1;
        });
      }, 1000);

      // Change prompts every 60 seconds
      promptIntervalRef.current = setInterval(() => {
        setCurrentPrompt(mindfulnessPrompts[Math.floor(Math.random() * mindfulnessPrompts.length)]);
      }, 60000);
    } else {
      clearInterval(intervalRef.current);
      clearInterval(promptIntervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(promptIntervalRef.current);
    };
  }, [isActive, isPaused, completeSession]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentPrompt(mindfulnessPrompts[Math.floor(Math.random() * mindfulnessPrompts.length)]);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(selectedTime * 60);
    setCurrentPrompt(mindfulnessPrompts[0]);
  };

  const selectTime = (minutes) => {
    if (!isActive) {
      setSelectedTime(minutes);
      setTimeLeft(minutes * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = selectedTime * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getPhase = () => {
    const progress = getProgress();
    if (progress < 25) return { phase: "Getting settled", color: "text-blue-600" };
    if (progress < 75) return { phase: "Deep focus", color: "text-purple-600" };
    return { phase: "Winding down", color: "text-green-600" };
  };

  const currentPhase = getPhase();

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Timer className="w-5 h-5 text-purple-600" />
            Mindfulness Timer
          </CardTitle>
          <p className="text-purple-600">
            Take a moment to center yourself and find inner peace
          </p>
        </CardHeader>
      </Card>

      {/* Time Selection */}
      {!isActive && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-800">Choose Your Session</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {timerPresets.map((preset) => (
                <motion.button
                  key={preset.minutes}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectTime(preset.minutes)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    selectedTime === preset.minutes
                      ? "border-purple-400 bg-purple-50 shadow-md"
                      : "border-slate-200 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  <Clock className={`w-6 h-6 mx-auto mb-2 ${
                    selectedTime === preset.minutes ? "text-purple-600" : "text-slate-400"
                  }`} />
                  <p className="text-sm font-medium text-slate-800">{preset.label}</p>
                  <p className="text-xs text-slate-500">{preset.minutes} minutes</p>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timer Display */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="max-w-md mx-auto text-center space-y-8">
            {/* Timer Circle */}
            <div className="relative w-56 h-56 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-slate-200"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-purple-500"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                  initial={false}
                  animate={{
                    strokeDashoffset: `${2 * Math.PI * 45 * (1 - getProgress() / 100)}`
                  }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  {isActive && (
                    <div className={`text-sm font-medium ${currentPhase.color}`}>
                      {currentPhase.phase}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mindfulness Prompt */}
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  key={currentPrompt}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl"
                >
                  <p className="text-purple-800 font-medium leading-relaxed">
                    {currentPrompt}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {!isActive ? (
                <Button
                  onClick={startTimer}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Session
                </Button>
              ) : (
                <>
                  <Button
                    onClick={isPaused ? resumeTimer : pauseTimer}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    size="lg"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Session Stats */}
            {completedSessions > 0 && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">
                  🎉 Sessions completed today: {completedSessions}
                </p>
                <p className="text-green-600 text-sm">
                  Great job taking care of your mental wellness!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}