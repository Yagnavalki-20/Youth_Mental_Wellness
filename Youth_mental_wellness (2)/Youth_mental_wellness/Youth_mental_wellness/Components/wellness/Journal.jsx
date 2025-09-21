import React, { useState, useEffect } from "react";
import { MoodEntry } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Save, 
  Calendar,
  Trash2,
  Plus,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Journal() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    setIsLoading(true);
    try {
      // Get mood entries that have journal content
      const entries = await MoodEntry.list("-created_date", 50);
      const journalEntries = entries.filter(entry => entry.journal_entry && entry.journal_entry.trim());
      setJournalEntries(journalEntries);
    } catch (error) {
      console.error("Error loading journal entries:", error);
    }
    setIsLoading(false);
  };

  const saveJournalEntry = async () => {
    if (!currentEntry.trim()) return;
    
    setIsSaving(true);
    try {
      await MoodEntry.create({
        mood_rating: 5, // Default neutral mood for journal-only entries
        emotions: [],
        journal_entry: currentEntry,
        triggers: [],
        coping_strategies_used: []
      });
      
      setCurrentEntry("");
      setIsWriting(false);
      loadJournalEntries();
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
    setIsSaving(false);
  };

  const filteredEntries = journalEntries.filter(entry =>
    entry.journal_entry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Personal Journal
          </CardTitle>
          <p className="text-blue-600">
            Express your thoughts and feelings in this private space
          </p>
        </CardHeader>
      </Card>

      {/* Write New Entry */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">New Entry</h3>
            {!isWriting && (
              <Button
                onClick={() => setIsWriting(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write
              </Button>
            )}
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isWriting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CardContent className="space-y-4">
                <Textarea
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  placeholder="What's on your mind today? Write freely about your thoughts, feelings, experiences..."
                  className="min-h-32 border-slate-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
                />
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsWriting(false);
                      setCurrentEntry("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveJournalEntry}
                    disabled={!currentEntry.trim() || isSaving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? (
                      <>
                        <Save className="w-4 h-4 mr-2 animate-pulse" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Entry
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Search */}
      {journalEntries.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search your journal entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journal Entries */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-3 bg-slate-200 rounded" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEntries.length > 0 ? (
          <AnimatePresence>
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(entry.created_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                      </div>
                      {entry.mood_rating !== 5 && (
                        <div className="text-xs text-slate-400">
                          Mood: {entry.mood_rating}/10
                        </div>
                      )}
                    </div>
                    
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {entry.journal_entry}
                      </p>
                    </div>
                    
                    {entry.emotions && entry.emotions.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {entry.emotions.map((emotion, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                {searchTerm ? "No matching entries" : "Start your journaling journey"}
              </h3>
              <p className="text-slate-500 mb-4">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Writing can help you process emotions and gain clarity"
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsWriting(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Write Your First Entry
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}