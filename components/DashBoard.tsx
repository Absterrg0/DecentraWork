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
import { MessageCircle,PlusCircle } from 'lucide-react';

const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function DashBoardComponent() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 100000000000]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const { data: session, status } = useSession();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(true);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  useEffect(() => {
    fetchProjects();
    checkProfileCompletion();
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/')
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
      }
    }
  };
  const handleMessages = () =>{
    router.push(`/user/${session?.user.id}/messages`)
  }
  const handleCreateProject = () =>{
    router.push('/projects/create')
  }

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
    <div className="min-h-screen bg-[#222629] text-gray-300">
 <motion.header 
  className="bg-[#222629] shadow-lg sticky top-0 z-50"
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  <div className="container mx-auto px-4 py-4 flex justify-between items-center">
    <motion.h1 
      className="text-3xl font-bold text-[#86C232]"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      DecentraWork
    </motion.h1>

    <div className="flex items-center space-x-4">
      <button 
        className="text-gray-300 hover:text-[#86C232] transition-colors duration-300 flex items-center" 
        onClick={handleMessages} // Handle the messages click event
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <button 
        className="text-gray-300 hover:text-[#86C232] transition-colors duration-300 flex items-center" 
        onClick={handleCreateProject} // Handle the create project click event
      >
        <PlusCircle className="h-6 w-6" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-[#86C232] transition-colors duration-300">
            <motion.div 
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar className="h-10 w-10 ring-2 ring-[#86C232]">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              {!isProfileComplete && (
                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-[#222629]" />
              )}
            </motion.div>
            <span>{session?.user.name}</span>
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#2F3439] border border-[#86C232] rounded-lg shadow-xl">
          <DropdownMenuItem className="text-gray-300 hover:bg-[#474B4F] hover:text-[#86C232] transition-colors duration-300" onClick={handleMyProfile}>
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-300 hover:bg-[#474B4F] hover:text-[#86C232] transition-colors duration-300" onClick={handleMyProposals}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>My Proposals</span>
          </DropdownMenuItem>
          {!isProfileComplete && (
            <DropdownMenuItem className="text-gray-300 hover:bg-[#474B4F] hover:text-[#86C232] transition-colors duration-300" onClick={() => setShowProfileModal(true)}>
              <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
              <span>Complete Profile</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-gray-300 hover:bg-[#474B4F] hover:text-[#86C232] transition-colors duration-300" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</motion.header>
    <main className="container mx-auto px-4 py-12">
      <motion.h2 
        className="text-5xl font-bold mb-12 text-center text-[#86C232]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Projects:
      </motion.h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <motion.div
          className="w-full lg:w-1/4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ease:'easeIn'}}
        >
          <Card className="bg-[#2F3439] border-[#86C232] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-[#86C232]">
                <Filter className="mr-2" size={24} />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm text-gray-400">Search Projects</label>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-2 bg-[#474B4F] text-gray-300 placeholder-gray-500 border-[#86C232] focus:ring-[#86C232] focus:border-[#86C232]"
                  placeholder="Type here"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Skills</label>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="mt-2 bg-[#474B4F] text-gray-300 border-[#86C232] focus:ring-[#86C232] focus:border-[#86C232]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2F3439] border-[#86C232]">
                    <SelectItem value="all">All</SelectItem>
                    {allSkills.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400">Budget Range</label>
                <Slider
                  value={budgetRange}
                  onValueChange={setBudgetRange}
                  min={0}
                  max={10000}
                  step={100}
                  className="mt-2 text-[#86C232]"
                />
                <p className="text-sm text-gray-400 mt-2">
                  ${budgetRange[0]} - ${budgetRange[1]}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-400">Experience</label>
                <div className="space-y-2 mt-2">
                  {experienceLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedExperience.includes(level)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedExperience((prev) => [...prev, level]);
                          } else {
                            setSelectedExperience((prev) => prev.filter((exp) => exp !== level));
                          }
                        }}
                        className="border-[#86C232] text-[#86C232]"
                      />
                      <span className="text-gray-300">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project List */}
        <motion.div 
          className="w-full lg:w-3/4 space-y-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4 }}
                >
<Card className="bg-[#2F3439] border-[#86C232] shadow-lg hover:shadow-xl transition-shadow duration-300  rounded-lg">
  <CardHeader>
    <CardTitle className="text-[#86C232] text-2xl truncate">{project.title}</CardTitle>
    <CardDescription className="text-gray-400 truncate">
      Posted on {new Date(project.createdAt).toLocaleDateString()}
    </CardDescription>
  </CardHeader>

  <CardContent>
    {/* Description with ellipsis */}
    <p className="text-gray-300 line-clamp-3">
      {project.description}
    </p>

    {/* Displaying required experience as a badge */}
    <div className="mt-4">
      <Badge className="bg-[#474B4F] text-[#86C232] border border-[#86C232]">
        {project.experienceReq} Experience
      </Badge>
    </div>

    {/* Displaying skills */}
    <div className="mt-2 flex flex-wrap space-x-2">
      {project.skillsRequired.map((skill) => (
        <Badge key={skill} className="bg-[#474B4F] text-[#86C232] border border-[#86C232]">
          {skill}
        </Badge>
      ))}
    </div>
  </CardContent>

  <CardFooter className="flex justify-between items-center text-gray-300 mt-4">
    <div className="flex items-center space-x-4">
      <span className="text-md flex items-center">
        <DollarSign size={16} className="mr-1 text-[#86C232]" />
        Budget: {project.budget}$
      </span>
      <span className="text-md flex items-center">
        <Calendar size={12} className="mr-1 text-[#86C232]" />
        Time expected: {project.timeExpected}
      </span>
    </div>

    {/* Apply button */}
    <Button
      className="bg-gradient-to-r from-[#86C232] to-[#61892F] hover:from-[#61892F] hover:to-[#86C232] text-white px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105"
      onClick={() => handleApply(project.id)}  // Add your apply handler here
    >
      Apply Now
    </Button>
  </CardFooter>
</Card>



                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                No projects found.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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