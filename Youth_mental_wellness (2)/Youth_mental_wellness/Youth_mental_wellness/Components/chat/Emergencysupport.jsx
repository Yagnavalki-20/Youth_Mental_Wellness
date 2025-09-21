import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Phone, MessageCircle, X } from "lucide-react";
import { motion } from "framer-motion";

export default function EmergencySupport({ onClose }) {
  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support"
    },
    {
      name: "Crisis Text Line",
      number: "741741",
      description: "Text HOME to connect"
    },
    {
      name: "AASRA (India)",
      number: "+91-9820466726", 
      description: "24/7 emotional support"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold mb-2">We're concerned about you</p>
              <p className="text-sm">
                If you're having thoughts of hurting yourself, please reach out for immediate help. 
                You don't have to go through this alone.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-red-600 hover:bg-red-100 -mt-1 -mr-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <Card className="mt-4 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-900">{contact.name}</p>
                <p className="text-sm text-red-700">{contact.description}</p>
              </div>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => window.open(`tel:${contact.number}`, '_blank')}
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              Remember: Seeking help is a sign of strength, not weakness. 
              Professional counselors are trained to help you through this.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}