'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, DollarSign, Calendar, Tags, ChevronDown, User, Briefcase, LogOut, Filter, AlertCircle } from 'lucide-react';
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
import { signOut, useSession } from 'next-auth/react';
import ProfileCompletionModal from './ui/profile-modal';

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

interface User {
  id: number;
  name: string;
  email: string;
  experience: string | null;
  skills: string[] | null;
  bio: string | null;
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
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(true);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [sortByLatest, setSortByLatest] = useState<boolean>(false);

  useEffect(() => {
    fetchProjects();
    checkProfileCompletion();
  }, [session]);

  const handleSignOut = () => {
    signOut();
  };

  const checkProfileCompletion = async () => {
    if (status === "authenticated" && session?.user?.id) {
      try {
        const response = await axios.get(`/api/user/account/${session.user.id}`);
        const userData: User = response.data;
        const isComplete = Boolean(userData.experience && userData.skills && userData.skills.length > 0 && userData.bio);
        console.log(isComplete);
        setIsProfileComplete(isComplete);
        if (!isComplete) {
          setShowProfileModal(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const handleMyProposals = () => {
    if (status === "authenticated" && session?.user?.id) {
      router.push(`/user/${session.user.id}/proposals`);
    } else if (status === "unauthenticated") {
      router.push('/login');
    } else {
      console.error('User session is loading or user ID is not available');
    }
  };

  const handleMyProfile = () => {
    if (status === "authenticated" && session?.user?.id) {
      router.push(`/user/${session.user.id}`);
    } else if (status === "unauthenticated") {
      router.push('/login');
    } else {
      console.error('User session is loading or user ID is not available');
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

  const sortedProjects = sortByLatest 
    ? filteredProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) 
    : filteredProjects;

  const handleApply = (projectId: number) => {
    router.push(`/projects/${projectId}/apply`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <header className="bg-black bg-opacity-30 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">DecentraWork</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors duration-300">
                <div className="relative">
                  <Avatar className="h-8 w-8 ring-2 ring-yellow-400">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  {!isProfileComplete && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </div>
                <span>{session?.user.name}</span>
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
                <span onClick={handleMyProposals}>My Proposals</span>
              </DropdownMenuItem>
              {!isProfileComplete && (
                <DropdownMenuItem className="text-white hover:bg-yellow-400 hover:text-black cursor-pointer transition-colors duration-300" onClick={() => setShowProfileModal(true)}>
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                  <span>Complete Profile</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-white hover:bg-yellow-400 hover:text-black cursor-pointer transition-colors duration-300" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <motion.h2 
          className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500"
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
                <label className="text-sm text-gray-400">Search</label>
                <Input
                  placeholder="Search Projects"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Skills</label>
                <Select onValueChange={setSelectedSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {allSkills.map((skill, index) => (
                      <SelectItem key={index} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400">Budget Range</label>
                <Slider
                  value={budgetRange}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={setBudgetRange}
                />
                <div className="flex justify-between text-gray-400">
                  <span>${budgetRange[0]}</span>
                  <span>${budgetRange[1]}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Experience Level</label>
                {experienceLevels.map(level => (
                  <div key={level} className="flex items-center">
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
                    <label htmlFor={level} className="ml-2 text-sm text-gray-300">{level}</label>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Sort by Latest</label>
                <Checkbox
                  checked={sortByLatest}
                  onCheckedChange={setSortByLatest}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Projects List */}
          <div className="w-full lg:w-3/4">
            <AnimatePresence>
              {sortedProjects.length === 0 ? (
                <motion.div
                  key="no-projects"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-400"
                >
                  <h3>No projects found</h3>
                </motion.div>
              ) : (
                sortedProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    <Card className="bg-gray-800 border border-yellow-400 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-yellow-400">{project.title}</CardTitle>
                        <CardDescription className="text-gray-400">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                          <div className="flex flex-wrap mt-2">
  {project.skillsRequired.map((skill, index) => (
    <Badge key={index} variant="outline" className="bg-yellow-400 text-gray-900 ml-2">
      {skill}
    </Badge>
  ))}
</div>

                            <Badge variant="destructive" className="bg-yellow-400 text-gray-900 ml-2">
                              {project.experienceReq}
                            </Badge>
                          </div>
                          <Button variant="outline" onClick={() => handleApply(project.id)} className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300">
                            Apply Now
                          </Button>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-400">Budget: ${project.budget}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-400">Posted on: {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      {showProfileModal && (
        <ProfileCompletionModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onComplete={() => {
            setIsProfileComplete(true);
            setShowProfileModal(false);
            checkProfileCompletion(); // Re-check profile completion after modal is closed
          }}
        />
      )}
    </div>
  );
}
