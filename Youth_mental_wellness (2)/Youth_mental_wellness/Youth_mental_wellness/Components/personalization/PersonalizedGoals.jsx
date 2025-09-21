import React, { useState, useEffect } from "react";
import { PersonalizedGoal } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  Plus,
  CheckCircle2,
  Clock,
  TrendingUp,
  Bell,
  BellOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const goalTypeConfig = {
  mood_improvement: {
    icon: "❤️",
    color: "text-pink-600",
    bg: "bg-pink-50",
    description: "Track and improve your daily mood ratings"
  },
  stress_reduction: {
    icon: "🧘",
    color: "text-blue-600",
    bg: "bg-blue-50",
    description: "Use mindfulness and coping strategies to reduce stress"
  },
  mindfulness_practice: {
    icon: "🧘‍♀️",
    color: "text-purple-600",
    bg: "bg-purple-50",
    description: "Build a consistent mindfulness and meditation practice"
  },
  journal_consistency: {
    icon: "📝",
    color: "text-green-600",
    bg: "bg-green-50",
    description: "Maintain regular journaling for emotional processing"
  },
  chat_engagement: {
    icon: "💬",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    description: "Regular check-ins with AI counselor for support"
  }
};

export default function PersonalizedGoals() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    goal_type: "",
    target_value: 7,
    target_date: "",
    reminder_frequency: "daily"
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const data = await PersonalizedGoal.list("-created_date");
      setGoals(data);
    } catch (error) {
      console.error("Error loading goals:", error);
    }
    setIsLoading(false);
  };

  const createGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.goal_type) return;
    
    try {
      await PersonalizedGoal.create({
        ...newGoal,
        target_date: newGoal.target_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      setNewGoal({
        title: "",
        description: "",
        goal_type: "",
        target_value: 7,
        target_date: "",
        reminder_frequency: "daily"
      });
      
      setShowCreateDialog(false);
      loadGoals();
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const toggleReminders = async (goal) => {
    try {
      const newFrequency = goal.reminder_frequency === "never" ? "daily" : "never";
      await PersonalizedGoal.update(goal.id, {
        reminder_frequency: newFrequency
      });
      loadGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "text-green-600";
    if (progress >= 75) return "text-blue-600";
    if (progress >= 50) return "text-yellow-600";
    return "text-slate-600";
  };

  const activeGoals = goals.filter(goal => goal.is_active && !goal.completed_date);
  const completedGoals = goals.filter(goal => goal.completed_date);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/2" />
            <div className="space-y-3">
              {Array(2).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Personal Wellness Goals
            </CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-1" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Wellness Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Goal Type</label>
                    <Select value={newGoal.goal_type} onValueChange={(value) => setNewGoal({...newGoal, goal_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose goal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(goalTypeConfig).map(([type, config]) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <span>{config.icon}</span>
                              <span>{type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Goal Title</label>
                    <Input
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="e.g., Check mood daily for 2 weeks"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      placeholder="What do you hope to achieve?"
                      className="h-20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target (days/sessions)</label>
                      <Input
                        type="number"
                        value={newGoal.target_value}
                        onChange={(e) => setNewGoal({...newGoal, target_value: parseInt(e.target.value)})}
                        min="1"
                        max="365"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Date</label>
                      <Input
                        type="date"
                        value={newGoal.target_date}
                        onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createGoal} disabled={!newGoal.title.trim() || !newGoal.goal_type}>
                      Create Goal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {activeGoals.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700">Active Goals</h3>
              <AnimatePresence>
                {activeGoals.map((goal, index) => {
                  const config = goalTypeConfig[goal.goal_type];
                  const progressPercent = Math.min((goal.current_progress / goal.target_value) * 100, 100);
                  const daysLeft = Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${config?.bg || 'bg-slate-50'} border-slate-200`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{config?.icon || "🎯"}</span>
                          <div>
                            <h4 className="font-semibold text-slate-800">{goal.title}</h4>
                            {goal.description && (
                              <p className="text-sm text-slate-600">{goal.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReminders(goal)}
                            className="text-slate-500 hover:text-slate-700"
                          >
                            {goal.reminder_frequency === "never" ? (
                              <BellOff className="w-4 h-4" />
                            ) : (
                              <Bell className="w-4 h-4" />
                            )}
                          </Button>
                          
                          {progressPercent >= 100 && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className={`font-medium ${getProgressColor(progressPercent)}`}>
                            {goal.current_progress}/{goal.target_value}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                        
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>{Math.round(progressPercent)}% complete</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
          
          {completedGoals.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Completed Goals ({completedGoals.length})
              </h3>
              <div className="grid gap-3">
                {completedGoals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">{goal.title}</span>
                      <Badge variant="outline" className="ml-auto text-green-600 border-green-300">
                        Completed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeGoals.length === 0 && completedGoals.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-600 mb-2">Set Your First Wellness Goal</h3>
              <p className="text-slate-500 text-sm mb-4">
                Goals help you build healthy habits and track your mental wellness journey
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}