import React, { useState } from "react";
import { UserFeedback } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  MessageSquare,
  Flag,
  Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function BiasReportButton({ chatSessionId = null, variant = "ghost" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    feedback_type: "bias_report",
    title: "",
    description: "",
    category: "",
    severity: "medium",
    anonymous: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.category) return;
    
    setIsSubmitting(true);
    try {
      await UserFeedback.create({
        ...formData,
        chat_session_id: chatSessionId
      });
      
      // Reset form
      setFormData({
        feedback_type: "bias_report",
        title: "",
        description: "",
        category: "",
        severity: "medium",
        anonymous: true
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size="sm" 
          className="text-slate-500 hover:text-red-600 hover:bg-red-50"
        >
          <Flag className="w-4 h-4 mr-1" />
          Report Issue
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Report Bias or Issue
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">Issue Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cultural_sensitivity">Cultural Sensitivity</SelectItem>
                <SelectItem value="gender_bias">Gender Bias</SelectItem>
                <SelectItem value="age_bias">Age Bias</SelectItem>
                <SelectItem value="accessibility">Accessibility</SelectItem>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="content">Content Concerns</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="severity">Severity</Label>
            <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minor concern</SelectItem>
                <SelectItem value="medium">Medium - Moderate concern</SelectItem>
                <SelectItem value="high">High - Significant issue</SelectItem>
                <SelectItem value="critical">Critical - Urgent attention needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="title">Brief Title (Optional)</Label>
            <Textarea
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief summary of the issue"
              className="h-20"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Please describe the issue you encountered. Be specific about what seemed biased or problematic..."
              className="h-24"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="anonymous"
              checked={formData.anonymous}
              onCheckedChange={(checked) => setFormData({...formData, anonymous: checked})}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Submit anonymously (recommended)
            </Label>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              🔒 Your feedback helps us improve the platform for everyone. 
              All reports are reviewed by our bias audit team and youth ambassadors.
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.description.trim() || !formData.category}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}