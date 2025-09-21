import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
  { value: "stress", label: "Stress Management" },
  { value: "relationships", label: "Relationships" },
  { value: "academic_pressure", label: "Academic Pressure" },
  { value: "family_issues", label: "Family Issues" },
  { value: "self_esteem", label: "Self Esteem" },
  { value: "general_wellness", label: "General Wellness" }
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="flex items-center gap-2 min-w-48">
      <Filter className="w-4 h-4 text-slate-400" />
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="border-slate-200 focus:border-blue-400 focus:ring-blue-400">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}