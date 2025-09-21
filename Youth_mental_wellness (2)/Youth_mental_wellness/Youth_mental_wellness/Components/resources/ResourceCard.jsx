import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  Target, 
  Phone,
  ExternalLink,
  Heart,
  Brain,
  Users,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const getCategoryIcon = (category) => {
  const icons = {
    anxiety: Brain,
    depression: Heart,
    stress: Zap,
    relationships: Users,
    academic_pressure: Target,
    family_issues: Users,
    self_esteem: Heart,
    general_wellness: BookOpen
  };
  return icons[category] || BookOpen;
};

const getCategoryColor = (category) => {
  const colors = {
    anxiety: "bg-blue-100 text-blue-800 border-blue-200",
    depression: "bg-purple-100 text-purple-800 border-purple-200",
    stress: "bg-red-100 text-red-800 border-red-200",
    relationships: "bg-pink-100 text-pink-800 border-pink-200",
    academic_pressure: "bg-yellow-100 text-yellow-800 border-yellow-200",
    family_issues: "bg-green-100 text-green-800 border-green-200",
    self_esteem: "bg-indigo-100 text-indigo-800 border-indigo-200",
    general_wellness: "bg-teal-100 text-teal-800 border-teal-200"
  };
  return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getTypeIcon = (type) => {
  const icons = {
    article: BookOpen,
    exercise: Target,
    technique: Zap,
    emergency_contact: Phone
  };
  return icons[type] || BookOpen;
};

export default function ResourceCard({ resource }) {
  const CategoryIcon = getCategoryIcon(resource.category);
  const TypeIcon = getTypeIcon(resource.resource_type);
  const categoryColor = getCategoryColor(resource.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <CategoryIcon className="w-4 h-4 text-slate-600" />
              </div>
              <Badge variant="outline" className={`${categoryColor} border text-xs`}>
                {resource.category.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <TypeIcon className="w-3 h-3" />
              {resource.resource_type.replace(/_/g, ' ')}
            </div>
          </div>
          
          <CardTitle className="text-lg leading-tight text-slate-800">
            {resource.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col h-full">
          <div className="flex-1">
            <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-4">
              {resource.content}
            </p>
            
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs text-slate-500 border-slate-200"
                  >
                    {tag}
                  </Badge>
                ))}
                {resource.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs text-slate-400">
                    +{resource.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {resource.estimated_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {resource.estimated_time}
                </div>
              )}
              {resource.difficulty_level && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    resource.difficulty_level === 'beginner'
                      ? 'border-green-300 text-green-700 bg-green-50'
                      : resource.difficulty_level === 'intermediate'
                      ? 'border-yellow-300 text-yellow-700 bg-yellow-50'
                      : 'border-red-300 text-red-700 bg-red-50'
                  }`}
                >
                  {resource.difficulty_level}
                </Badge>
              )}
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1"
              onClick={() => {
                // Here you could open a modal with full content or navigate to detailed view
                console.log("View resource:", resource);
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}