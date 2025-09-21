import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  WifiOff, 
  Wifi,
  Download,
  Smartphone,
  Signal,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onlineState !== false);
  const [showOptimization, setShowOptimization] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Detect connection speed
    if ('connection' in navigator) {
      const connection = navigator.connection;
      setConnectionSpeed(connection.effectiveType || 'unknown');
      
      connection.addEventListener('change', () => {
        setConnectionSpeed(connection.effectiveType || 'unknown');
      });
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isSlowConnection = connectionSpeed === 'slow-2g' || connectionSpeed === '2g';
  const shouldShowOptimization = !isOnline || isSlowConnection;

  const optimizationFeatures = [
    {
      icon: CheckCircle2,
      title: "Offline Mood Tracking",
      description: "Log your mood even without internet - syncs when connected"
    },
    {
      icon: Download,
      title: "Cached Resources",
      description: "Mental health resources are stored locally for offline access"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Designed for slow connections and mobile data"
    }
  ];

  return (
    <AnimatePresence>
      {shouldShowOptimization && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6"
        >
          <Card className={`border-0 shadow-lg ${
            !isOnline 
              ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' 
              : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  !isOnline ? 'bg-orange-200' : 'bg-yellow-200'
                }`}>
                  {!isOnline ? (
                    <WifiOff className="w-5 h-5 text-orange-700" />
                  ) : (
                    <Signal className="w-5 h-5 text-yellow-700" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-semibold ${
                      !isOnline ? 'text-orange-800' : 'text-yellow-800'
                    }`}>
                      {!isOnline 
                        ? 'You\'re Offline' 
                        : `Slow Connection (${connectionSpeed?.toUpperCase()})`
                      }
                    </h3>
                    
                    <Badge variant="outline" className={
                      !isOnline 
                        ? 'border-orange-300 text-orange-700 bg-orange-50'
                        : 'border-yellow-300 text-yellow-700 bg-yellow-50'
                    }>
                      {!isOnline ? 'No Internet' : 'Limited Bandwidth'}
                    </Badge>
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    !isOnline ? 'text-orange-700' : 'text-yellow-700'
                  }`}>
                    {!isOnline 
                      ? 'No internet connection detected. You can still use offline features.'
                      : 'Slow connection detected. App is optimized for low-bandwidth usage.'
                    }
                  </p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOptimization(!showOptimization)}
                    className={`${
                      !isOnline 
                        ? 'text-orange-700 hover:bg-orange-100' 
                        : 'text-yellow-700 hover:bg-yellow-100'
                    } p-0 h-auto font-medium`}
                  >
                    {showOptimization ? 'Hide' : 'Show'} Offline Features
                  </Button>
                </div>
              </div>
              
              <AnimatePresence>
                {showOptimization && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-orange-200"
                  >
                    <div className="grid md:grid-cols-3 gap-3">
                      {optimizationFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                          <feature.icon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-slate-800 text-sm">{feature.title}</h4>
                            <p className="text-xs text-slate-600">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">SMS Support Available</p>
                          <p className="text-xs">In case of emergency, text "HELP" to +91-9999666555 for immediate crisis support</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Online Status Indicator */}
      {isOnline && !isSlowConnection && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-4 left-4 z-40"
        >
          <Badge className="bg-green-600 text-white shadow-lg">
            <Wifi className="w-3 h-3 mr-1" />
            Online
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}