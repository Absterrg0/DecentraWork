'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, DollarSign, Calendar, ChevronDown, User, Briefcase, LogOut, Filter, Sparkles, PlusCircle, AlertCircle, MessageSquare, BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import ProfileCompletionModal from './ui/profile-modal';
import MessageOptions from './ui/messageOptions';

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
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  useEffect(() => {
    fetchProjects();
    checkProfileCompletion();
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleApply = async (projectId: number) => {
    router.push(`/projects/${projectId}/apply`);
  };

  const checkProfileCompletion = async () => {
    if (status === "authenticated" && session?.user?.id) {
      try {
        const response = await axios.get(`/api/user/account/${session.user.id}`);
        const userData: User = response.data;
        const isComplete = Boolean(userData.experience && userData.skills && userData.skills.length > 0 && userData.bio);
        setIsProfileComplete(isComplete);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsProfileComplete(false);
      }
    } else {
      setIsProfileComplete(null);
    }
  };

  const handleCreateProject = () => {
    router.push('/projects/create');
  };

  const handleMyProposals = () => {
    if (status === "authenticated" && session?.user?.id) {
      router.push(`/user/${session.user.id}/proposals`);
    } else if (status === "unauthenticated") {
      router.push('/login');
    }
  };

  const handleMyProfile = () => {
    if (status === "authenticated" && session?.user?.id) {
      router.push(`/user/${session.user.id}`);
    } else if (status === "unauthenticated") {
      router.push('/login');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0iIzUyNTI1MiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10 pointer-events-none"></div>

      <motion.header 
        className="fixed w-full top-0 z-50 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-4 sm:space-x-8"
              whileHover={{ scale: 1.02 }}
            >
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
                Decentra<span className="text-amber-500">Work</span>
              </h1>
              
              <div className="hidden md:flex items-center bg-zinc-800/50 rounded-full px-4 py-2 border border-zinc-700">
                <Search className="h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  className="bg-transparent border-none focus:outline-none text-sm ml-2 w-64 placeholder:text-zinc-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <MessageOptions />

              <Button 
                className="bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 rounded-full px-4 sm:px-6"
                onClick={handleCreateProject}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Post Project</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-1">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-zinc-700 transition-all duration-300 hover:ring-amber-500">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      {isProfileComplete === false && (
                        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-zinc-900" />
                      )}
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl">
                  <DropdownMenuItem onClick={handleMyProfile} className="hover:bg-zinc-700 focus:bg-zinc-700">
                    <User className="mr-2 h-4 w-4 text-amber-500" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMyProposals} className="hover:bg-zinc-700 focus:bg-zinc-700">
                    <Briefcase className="mr-2 h-4 w-4 text-amber-500" />
                    <span>My Projects</span>
                  </DropdownMenuItem>
                  {isProfileComplete === false && (
                    <DropdownMenuItem onClick={() => setShowProfileModal(true)} className="hover:bg-zinc-700 focus:bg-zinc-700">
                      <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                      <span>Complete Profile</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="hover:bg-zinc-700 focus:bg-zinc-700">
                    <LogOut className="mr-2 h-4 w-4 text-amber-500" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="pt-24 pb-12 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-8">
              <Sparkles className="h-6 w-6 text-amber-500 mr-3" />
              <h2 className="text-2xl font-bold">Featured Projects</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-zinc-800 border border-amber-500/50 rounded-xl overflow-hidden h-full shadow-lg shadow-amber-500/20">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge className="bg-amber-500/10 text-amber-500 border-none">
                          {project.experienceReq}
                        </Badge>
                        <span className="text-sm text-zinc-400">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-xl mt-3 text-zinc-100">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-zinc-400 line-clamp-2 mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.skillsRequired.slice(0, 3).map((skill) => (
                          <Badge key={skill} className="bg-zinc-700 text-amber-400 border-none">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              className="lg:w-72 shrink-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="sticky top-24">
                <Card className="bg-zinc-800 border border-zinc-700 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Filter className="h-5 w-5 text-amber-500 mr-2" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">Budget Range</label>
                      <Slider
                        value={budgetRange}
                        onValueChange={setBudgetRange}
                        min={0}
                        max={10000}
                        step={100}
                        className="text-amber-500"
                      />
                      <div className="flex justify-between mt-2 text-sm text-zinc-400">
                        <span>${budgetRange[0]}</span>
                        
                        <span>${budgetRange[1]}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">Skills</label>
                      <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                        <SelectTrigger className="bg-zinc-700">
                          <SelectValue placeholder="All Skills" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-700 border border-zinc-600">
                          <SelectItem value="all">All Skills</SelectItem>
                          {allSkills.map((skill) => (
                            <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">Experience Level</label>
                      <div className="space-y-2">
                        {experienceLevels.map((level) => (
                          <div key={level} className="flex items-center">
                            <Checkbox
                              id={`experience-${level}`}
                              checked={selectedExperience.includes(level)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedExperience((prev) => [...prev, level]);
                                } else {
                                  setSelectedExperience((prev) => 
                                    prev.filter((exp) => exp !== level)
                                  );
                                }
                              }}
                              className="border-zinc-600 text-amber-500"
                            />
                            <label htmlFor={`experience-${level}`} className="ml-2 text-sm text-zinc-300">{level}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="bg-zinc-800 border border-zinc-700 rounded-xl h-full">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-3">
                            <Badge className="bg-amber-500/10 text-amber-500 border-none">
                              {project.experienceReq}
                            </Badge>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                              <span className="text-sm text-zinc-400">
                                {project.timeExpected}
                              </span>
                            </div>
                          </div>
                          <CardTitle className="text-xl text-zinc-100 mb-2">
                            {project.title}
                          </CardTitle>
                          <CardDescription className="text-zinc-400">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.skillsRequired.map((skill) => (
                              <Badge key={skill} className="bg-zinc-700 text-amber-400 border-none">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <DollarSign className="h-5 w-5 text-amber-500 mr-1" />
                              <span className="text-lg font-semibold text-zinc-100">
                                {project.budget}
                              </span>
                            </div>
                            <Button
                              onClick={() => handleApply(project.id)}
                              className="bg-amber-500 hover:bg-amber-600 text-zinc-900 rounded-full px-6"
                            >
                              Apply Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-80 shrink-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="sticky top-24">
                <Card className="bg-zinc-800 border border-zinc-700 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="assigned">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="assigned">Assigned</TabsTrigger>
                        <TabsTrigger value="created">Created</TabsTrigger>
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                      </TabsList>
                      <TabsContent value="assigned">
                        <div className="space-y-4 mt-4">
                          <h3 className="text-sm font-medium text-zinc-300">Assigned Projects Messages</h3>
                          {/* Add content for assigned projects messages */}
                          <p className="text-zinc-400 text-sm">No new messages</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="created">
                        <div className="space-y-4 mt-4">
                          <h3 className="text-sm font-medium text-zinc-300">Created Projects Messages</h3>
                          {/* Add content for created projects messages */}
                          <p className="text-zinc-400 text-sm">No new messages</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="stats">
                        <div className="space-y-4 mt-4">
                          <h3 className="text-sm font-medium text-zinc-300">Profile Stats</h3>
                          {/* Add content for profile stats */}
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 text-sm">Completed Projects</span>
                            <span className="text-amber-500 font-medium">5</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 text-sm">Active Projects</span>
                            <span className="text-amber-500 font-medium">2</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 text-sm">Total Earnings</span>
                            <span className="text-amber-500 font-medium">$1,250</span>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
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
            checkProfileCompletion();
          }}
        />
      )}
    </div>
  );
}