import React from "react";
import { motion } from "framer-motion";
import { Heart, User, Sparkles } from "lucide-react";

export default function ChatMessage({ message, isLast }) {
  const isAI = message.sender === "ai";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"}`}
    >
      {isAI && (
        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
          <Heart className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
        isAI 
          ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 border border-blue-200" 
          : "bg-gradient-to-r from-teal-500 to-teal-600 text-white"
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.message}
        </p>
        
        {message.emotion_detected && isAI && (
          <div className="mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-500 capitalize">
              {message.emotion_detected}
            </span>
          </div>
        )}
        
        <div className={`text-xs mt-2 opacity-70 ${
          isAI ? "text-blue-600" : "text-teal-100"
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {!isAI && (
        <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
          <User className="w-5 h-5 text-slate-600" />
        </div>
      )}
    </motion.div>
  );
}