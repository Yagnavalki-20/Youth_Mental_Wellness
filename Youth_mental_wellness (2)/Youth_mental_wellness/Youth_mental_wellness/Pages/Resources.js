
import React, { useState, useEffect, useCallback } from "react";
import { Resource } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  BookOpen,
  Heart,
  Brain,
  Users,
  Phone,
  Clock,
  Filter,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ResourceCard from "../components/resources/ResourceCard";
import CategoryFilter from "../components/resources/CategoryFilter";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Memoize filterResources using useCallback
  const filterResources = useCallback(() => {
    let filtered = resources;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, selectedCategory]); // Dependencies for useCallback

  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      try {
        const data = await Resource.list();
        setResources(data);
      } catch (error) {
        console.error("Error loading resources:", error);
      }
      setIsLoading(false);
    };

    loadResources();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    filterResources();
  }, [filterResources]); // Depend on the memoized filterResources function

  const emergencyContacts = [
    {
      name: "AASRA - Suicide Prevention",
      phone: "+91-9820466726",
      description: "24/7 emotional support and suicide prevention helpline",
      availability: "24/7"
    },
    {
      name: "iCALL - Psychosocial Helpline",
      phone: "+91-9152987821",
      description: "Professional counseling and mental health support",
      availability: "Mon-Sat, 10 AM - 8 PM"
    },
    {
      name: "Vandrevala Foundation",
      phone: "+91-9999666555",
      description: "Free mental health support and crisis intervention",
      availability: "24/7"
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Mental Health Resources
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Evidence-based information, coping strategies, and professional support 
            to help you on your mental wellness journey.
          </p>
        </motion.div>

        {/* Emergency Contacts */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Phone className="w-5 h-5" />
              Emergency Support - Available Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-white rounded-lg border border-red-200"
                >
                  <h3 className="font-semibold text-red-900 mb-2">{contact.name}</h3>
                  <p className="text-sm text-red-700 mb-3">{contact.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <Clock className="w-3 h-3" />
                      {contact.availability}
                    </div>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => window.open(`tel:${contact.phone}`, '_blank')}
                    >
                      Call Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search resources, strategies, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                    <div className="h-3 bg-slate-200 rounded w-4/6" />
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {filteredResources.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No resources found
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms or category filter to find what you're looking for.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
