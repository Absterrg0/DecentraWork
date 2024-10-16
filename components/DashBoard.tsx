'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, DollarSign, Calendar, Tags, ChevronDown, User, Briefcase, LogOut, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  timeExpected: string;
  skillsRequired: string[];
  experienceReq: string;
  createdAt: string;
  clientId: number;
}

const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function DashBoardComponent() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 10000]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleMyProfile = () => {
    if (status === "authenticated" && session?.user?.id) {
      router.push(`/user/${session.user.id}`);
    } else if (status === "unauthenticated") {
      router.push('/login'); // Redirect to login page if not authenticated
    } else {
      console.error('User session is loading or user ID is not available');
      // Optionally show a loading state or error message to the user
    }
  };
  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      const data = response.data;
      setProjects(data);
      const skills = Array.from(new Set(data.flatMap((project: Project) => project.skillsRequired)));
      setAllSkills(skills as string[]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const filteredProjects = projects.filter(project =>
    (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSkill === 'all' || project.skillsRequired.includes(selectedSkill)) &&
    (project.budget >= budgetRange[0] && project.budget <= budgetRange[1]) &&
    (selectedExperience.length === 0 || selectedExperience.includes(project.experienceReq))
  );

  const handleApply = (projectId: number) => {
    router.push(`/projects/${projectId}/apply`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      <header className="bg-black bg-opacity-30 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">DecentraWork</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors duration-300">
                <Avatar className="h-8 w-8 ring-2 ring-yellow-400">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>Account</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black bg-opacity-90 border border-yellow-400">
              <DropdownMenuItem className="text-white hover:bg-yellow-400 hover:text-black cursor-pointer transition-colors duration-300" onClick={handleMyProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-yellow-400 hover:text-black cursor-pointer transition-colors duration-300">
                <Briefcase className="mr-2 h-4 w-4" />
                <span>My Projects</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-yellow-400 hover:text-black cursor-pointer transition-colors duration-300">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.h2 
          className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Exciting Projects
        </motion.h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <Card className="w-full lg:w-1/4 bg-black bg-opacity-50 backdrop-blur-md border-yellow-400 shadow-lg shadow-yellow-400/20">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-400">
                <Filter className="mr-2" size={24} />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-yellow-400">Search</label>
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black bg-opacity-50 border-yellow-400 focus:border-pink-500 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-yellow-400">Skill</label>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="w-full bg-black bg-opacity-50 border-yellow-400 text-white">
                    <SelectValue placeholder="Filter by skill" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-yellow-400 text-white">
                    <SelectItem value="all">All Skills</SelectItem>
                    {allSkills.map((skill) => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-yellow-400">Budget Range</label>
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={budgetRange}
                  onValueChange={setBudgetRange}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-yellow-400">
                  <span>${budgetRange[0]}</span>
                  <span>${budgetRange[1]}</span>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-yellow-400">Experience Level</label>
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
                      className="border-yellow-400 text-pink-500"
                    />
                    <label htmlFor={level} className="ml-2 text-sm text-white">{level}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Listings */}
          <div className="w-full lg:w-3/4">
            <AnimatePresence>
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-black bg-opacity-50 backdrop-blur-md border-yellow-400 hover:border-pink-500 transition-colors duration-300 shadow-lg hover:shadow-pink-500/20">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">{project.title}</CardTitle>
                          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                            NEW
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-300">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center">
                            <DollarSign className="text-yellow-400 mr-2" size={18} />
                            <span className="text-white font-medium">${project.budget.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="text-yellow-400 mr-2" size={18} />
                            <span className="text-gray-300">{project.timeExpected}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="text-yellow-400 mr-2" size={18} />
                            <span className="text-gray-300">{project.experienceReq}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Tags className="text-yellow-400 mr-2" size={18} />
                          {project.skillsRequired.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-yellow-400 bg-opacity-20 text-yellow-400">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => handleApply(project.id)} variant="default" className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white transition-all duration-300 transform hover:scale-105">
                          Apply Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}