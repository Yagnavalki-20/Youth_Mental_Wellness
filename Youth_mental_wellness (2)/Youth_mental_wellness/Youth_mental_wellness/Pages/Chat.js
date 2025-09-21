
import React, { useState, useEffect, useRef } from "react";
import { ChatSession } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Send, 
  Loader2, 
  Heart, 
  AlertTriangle,
  Sparkles,
  MessageCircle,
  Phone,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

import ChatMessage from "../components/chat/ChatMessage";
import EmergencySupport from "../components/chat/EmergencySupport";
import TypingIndicator from "../components/chat/TypingIndicator";
import BiasReportButton from "../components/feedback/BiasReportButton";

export default function Chat() {
  const [currentSession, setCurrentSession] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    startNewSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startNewSession = async () => {
    const newSession = {
      session_title: "New Chat Session",
      messages: [{
        sender: "ai",
        message: "Hi! I'm here to listen and support you. This is a safe, confidential space where you can share what's on your mind. How are you feeling today?",
        timestamp: new Date().toISOString(),
        emotion_detected: "welcoming"
      }],
      crisis_level: "low"
    };

    try {
      const session = await ChatSession.create(newSession);
      setCurrentSession({ ...newSession, id: session.id });
    } catch (error) {
      console.error("Error creating session:", error);
      setCurrentSession(newSession);
    }
  };

  const detectCrisisKeywords = (text) => {
    const crisisWords = ["suicide", "kill myself", "end it all", "hurt myself", "die", "can't go on"];
    const urgentWords = ["emergency", "crisis", "help me", "scared"];
    
    const lowerText = text.toLowerCase();
    
    if (crisisWords.some(word => lowerText.includes(word))) {
      return "urgent";
    }
    if (urgentWords.some(word => lowerText.includes(word))) {
      return "high";
    }
    return "low";
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      sender: "user",
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    // Detect crisis level
    const crisisLevel = detectCrisisKeywords(message);
    
    setCurrentSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      crisis_level: crisisLevel
    }));

    if (crisisLevel === "urgent") {
      setShowEmergency(true);
    }

    setMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Generate AI response
      const response = await InvokeLLM({
        prompt: `You are an empathetic AI mental health counselor specifically designed to support Indian youth aged 15-25. 

Context: The user has shared "${message.trim()}". This conversation is taking place in India where mental health stigma is high.

Guidelines:
- Be warm, non-judgmental, and culturally sensitive
- Use simple, accessible language 
- Acknowledge their feelings without minimizing them
- Offer practical coping strategies suitable for Indian context
- If detecting crisis language, gently guide toward professional help
- Be encouraging and hopeful
- Ask open-ended questions to encourage sharing
- Keep responses conversational and around 2-3 sentences

Previous conversation context: ${JSON.stringify(currentSession?.messages?.slice(-4) || [])}

Respond with empathy and support:`,
        response_json_schema: {
          type: "object",
          properties: {
            message: { type: "string" },
            emotion_detected: { type: "string" },
            suggested_resources: { 
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      const aiMessage = {
        sender: "ai",
        message: response.message,
        timestamp: new Date().toISOString(),
        emotion_detected: response.emotion_detected
      };

      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage]
      }));

      // Update session in database
      if (currentSession?.id) {
        await ChatSession.update(currentSession.id, {
          messages: [...currentSession.messages, userMessage, aiMessage],
          crisis_level: crisisLevel
        });
      }

    } catch (error) {
      console.error("Error generating response:", error);
      
      const fallbackMessage = {
        sender: "ai",
        message: "I'm here to listen. Sometimes it helps just to know someone cares. Would you like to tell me more about what's bothering you?",
        timestamp: new Date().toISOString(),
        emotion_detected: "supportive"
      };

      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, fallbackMessage]
      }));
    }

    setIsLoading(false);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col p-4 md:p-6">
      <div className="max-w-4xl mx-auto flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                AI Mental Health Support
                <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Available 24/7
                </div>
              </CardTitle>
              <p className="text-blue-600">
                This is a safe, confidential space. Share what's on your mind - I'm here to listen and support you.
              </p>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Emergency Alert */}
        <AnimatePresence>
          {showEmergency && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-4"
            >
              <EmergencySupport onClose={() => setShowEmergency(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages */}
        <Card className="flex-1 border-0 shadow-lg mb-4 overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {currentSession?.messages?.map((msg, index) => (
                  <div key={index}>
                    <ChatMessage
                      message={msg}
                      isLast={index === currentSession.messages.length - 1}
                    />
                    {/* Add bias report button for AI messages */}
                    {msg.sender === "ai" && index === currentSession.messages.length - 1 && (
                      <div className="flex justify-end mt-2">
                        <BiasReportButton 
                          chatSessionId={currentSession?.id}
                          variant="ghost"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </AnimatePresence>
              
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here... Remember, this is a safe space."
                  className="flex-1 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Response in ~5 seconds
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI-powered support
                </div>
                {/* Add general feedback option */}
                <div className="ml-auto">
                  <BiasReportButton variant="ghost" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
