import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 justify-start"
    >
      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
        <Heart className="w-5 h-5 text-white" />
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 border border-blue-200 px-4 py-3 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-blue-600">AI is typing...</span>
        </div>
      </div>
    </motion.div>
  );
}