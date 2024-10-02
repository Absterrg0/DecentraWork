'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, DollarSign, Calendar, Tags, ChevronDown, User, Briefcase, LogOut, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skillTags: string[];
  status: string;
  experience: string;
}

const mockProjects: Project[] = [
  {
    id: 1,
    title: "Develop E-commerce Website",
    description: "Create a full-stack e-commerce website with React and Node.js",
    budget: 5000,
    deadline: "2023-12-31",
    skillTags: ["React", "Node.js", "MongoDB"],
    status: "OPEN",
    experience: "Intermediate",
  },
  {
    id: 2,
    title: "Mobile App for Fitness Tracking",
    description: "Design and develop a cross-platform mobile app for fitness enthusiasts",
    budget: 8000,
    deadline: "2024-03-15",
    skillTags: ["React Native", "Firebase", "UX/UI Design"],
    status: "OPEN",
    experience: "Advanced",
  },
  {
    id: 3,
    title: "AI-powered Chatbot",
    description: "Implement an AI chatbot for customer support using natural language processing",
    budget: 6500,
    deadline: "2024-02-28",
    skillTags: ["Python", "NLP", "Machine Learning"],
    status: "OPEN",
    experience: "Expert",
  },
];

const allSkills = Array.from(new Set(mockProjects.flatMap(project => project.skillTags)));
const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function MainJobListingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 10000]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);

  useEffect(() => {
    setProjects(mockProjects);
  }, []);

  const filteredProjects = projects.filter(project =>
    (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSkill === 'all' || project.skillTags.includes(selectedSkill)) &&
    (project.budget >= budgetRange[0] && project.budget <= budgetRange[1]) &&
    (selectedExperience.length === 0 || selectedExperience.includes(project.experience))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-100">
      <header className="bg-zinc-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-400">DecentraWork</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>Account</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-800 border border-zinc-700">
              <DropdownMenuItem className="text-zinc-100 hover:bg-zinc-700 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-100 hover:bg-zinc-700 cursor-pointer">
                <Briefcase className="mr-2 h-4 w-4" />
                <span>My Projects</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-100 hover:bg-zinc-700 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-8 text-center">Available Projects</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="w-full md:w-1/4 bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
              <Filter className="mr-2" size={24} />
              Filters
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">Search</label>
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-700 border-zinc-600 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Skill</label>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="w-full bg-zinc-700 border-zinc-600">
                    <SelectValue placeholder="Filter by skill" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="all">All Skills</SelectItem>
                    {allSkills.map((skill) => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Budget Range</label>
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={budgetRange}
                  onValueChange={setBudgetRange}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span>${budgetRange[0]}</span>
                  <span>${budgetRange[1]}</span>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Experience Level</label>
                {experienceLevels.map((level) => (
                  <div key={level} className="flex items-center mb-2">
                    <Checkbox
                      id={level}
                      checked={selectedExperience.includes(level)}
                      onCheckedChange={(checked) => {
                        setSelectedExperience(prev =>
                          checked
                            ? [...prev, level]
                            : prev.filter(l => l !== level)
                        );
                      }}
                    />
                    <label htmlFor={level} className="ml-2 text-sm">{level}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Listings */}
          <div className="w-full md:w-3/4">
            <AnimatePresence>
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden border border-zinc-700 hover:border-indigo-500 transition-colors duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-semibold text-indigo-400">{project.title}</h3>
                        <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-zinc-300 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center">
                          <DollarSign className="text-indigo-400 mr-2" size={18} />
                          <span className="text-zinc-200 font-medium">${project.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="text-indigo-400 mr-2" size={18} />
                          <span className="text-zinc-300">{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="text-indigo-400 mr-2" size={18} />
                          <span className="text-zinc-300">{project.experience}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Tags className="text-indigo-400 mr-2" size={18} />
                        {project.skillTags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-zinc-700 text-zinc-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="default" className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300">
                        Apply Now
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}