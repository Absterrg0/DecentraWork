'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, X, Briefcase, DollarSign, Calendar, User, Mail } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  experience: string | null;
  skills: string[];
  bio: string | null;
}

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  timeExpected: string;
  experienceReq: string;
  skillsRequired: string[];
  client: {
    id: number;
    name: string;
    email: string;
  };
}

export default function ProfileComponent() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile(session.user.id);
      fetchUserProjects(session.user.id);
    }
  }, [session]);

  const fetchUserProfile = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/user/account/${id}`);
      setUser(data);
      setEditedUser(data);
    } catch (err) {
      setError('Failed to load user profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProjects = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/projects/${id}/info`);
      setProjects(Array.isArray(data.project) ? data.project : [data.project]);
    } catch (err) {
      console.error('Failed to load user projects:', err);
      setError('Failed to load user projects.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/user/account/${user?.id}`, editedUser);
      setUser(editedUser);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update user profile.');
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-yellow-500 text-2xl font-light"
      >
        Loading...
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-red-500 text-xl"
      >
        {error}
      </motion.div>
    </div>
  );

  if (!user) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-yellow-500 text-xl"
      >
        User not found
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 text-yellow-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-gray-800 border-yellow-600 border-opacity-50 overflow-hidden shadow-lg">
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-800 opacity-75" />
            <div className="relative z-10 flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-4 border-yellow-400">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
                <AvatarFallback className="bg-yellow-700 text-yellow-100">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-bold text-yellow-100">{user.name}</CardTitle>
                <p className="text-yellow-200 opacity-80">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-6">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-yellow-100">Profile</TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-yellow-100">Projects</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="name" className="text-yellow-300">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editedUser?.name || ''}
                        onChange={handleChange}
                        className="bg-gray-700 border-yellow-600 text-yellow-100 focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-yellow-300">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={editedUser?.bio || ''}
                        onChange={handleChange}
                        className="bg-gray-700 border-yellow-600 text-yellow-100 focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="text-yellow-300">Experience Level</Label>
                      <Input
                        id="experience"
                        name="experience"
                        value={editedUser?.experience || ''}
                        onChange={handleChange}
                        className="bg-gray-700 border-yellow-600 text-yellow-100 focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="skills" className="text-yellow-300">Skills (comma-separated)</Label>
                      <Input
                        id="skills"
                        name="skills"
                        value={editedUser?.skills.join(', ') || ''}
                        onChange={(e) => setEditedUser(prev => prev ? { ...prev, skills: e.target.value.split(',').map(skill => skill.trim()) } : null)}
                        className="bg-gray-700 border-yellow-600 text-yellow-100 focus:border-yellow-400"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} className="bg-yellow-600 hover:bg-yellow-700 text-yellow-100">
                        <Save className="mr-2 h-4 w-4" /> Save
                      </Button>
                      <Button onClick={handleCancel} variant="destructive" className="border-yellow-600 text-yellow-100 hover:bg-red-800">
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label className="text-yellow-300">Bio</Label>
                      <p className="text-yellow-100">{user.bio || 'No bio available'}</p>
                    </div>
                    <div>
                      <Label className="text-yellow-300">Experience Level</Label>
                      <p className="text-yellow-100">{user.experience || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-yellow-300">Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-yellow-700 text-yellow-100">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleEdit} className="bg-yellow-600 hover:bg-yellow-700 text-yellow-100">
                      <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </motion.div>
                )}
              </TabsContent>
              <TabsContent value="projects">
                <div className="space-y-4">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="bg-gray-700 border-yellow-600 border-opacity-50">
                          <CardHeader>
                            <CardTitle className="text-xl flex items-center text-yellow-300">
                              <Briefcase className="mr-2 h-5 w-5 text-yellow-400" />
                              {project.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-yellow-100 mb-4">{project.description}</p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center">
                                <DollarSign className="mr-2 h-5 w-5 text-yellow-400" />
                                <span className="text-yellow-100">Budget: ${project.budget}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5 text-yellow-400" />
                                <span className="text-yellow-100">Time: {project.timeExpected}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="mr-2 h-5 w-5 text-yellow-400" />
                                <span className="text-yellow-100">Experience: {project.experienceReq}</span>
                              </div>
                            </div>
                            <div className="mb-4">
                              <Label className="text-yellow-300">Required Skills</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {project.skillsRequired.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="bg-yellow-700 text-yellow-100">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label className="text-yellow-300">Client</Label>
                              <div className="flex items-center mt-2">
                                <User className="mr-2 h-5 w-5 text-yellow-400" />
                                <span className="text-yellow-100 mr-4">{project.client.name}</span>
                                <Mail className="mr-2 h-5 w-5 text-yellow-400" />
                                <span className="text-yellow-100">{project.client.email}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-yellow-300">No projects found.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}