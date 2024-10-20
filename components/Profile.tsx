'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit2, Save, X, Briefcase, DollarSign, Calendar, User, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  email: string
  experience: string | null
  skills: string[]
  bio: string | null
  walletAddressSOL: string
  walletAddressETH: string
  projectsCreated: Project[]; // Added property
}

interface Project {
  id: number
  title: string
  description: string
  budget: number
  timeExpected: string | null
  experienceReq: string
  skillsRequired: string[]
  client: {
    id: number
    name: string
    email: string
  }
}

export default function Component() {
  const { data: session } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile(session.user.id)
    }
  }, [session])

  const fetchUserProfile = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/user/account/${id}`)
      setUser(data)
      setEditedUser(data)
      setIsOwner(session?.user?.id === data.id.toString())
    } catch (err) {
      setError('Failed to load user profile.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    if (isOwner) {
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (isOwner) {
      try {
        await axios.put(`/api/user/account/${user?.id}`, editedUser)
        setUser(editedUser)
        setIsEditing(false)
      } catch (err) {
        setError('Failed to update user profile.')
      }
    }
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null)
  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-[#222629]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-[#86C232] text-2xl font-light"
      >
        Loading...
      </motion.div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-[#222629]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-red-500 text-xl"
      >
        {error}
      </motion.div>
    </div>
  )

  if (!user) return (
    <div className="flex justify-center items-center h-screen bg-[#222629]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-[#86C232] text-xl"
      >
        User not found
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222629] via-[#2F3439] to-[#474B4F] text-[#C5C6C7] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-[#2F3439] border-[#86C232] border-opacity-50 overflow-hidden shadow-lg">
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#86C232] to-[#61892F] opacity-75" />
            <div className="relative z-10 flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-4 border-[#86C232]">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
                <AvatarFallback className="bg-[#61892F] text-[#C5C6C7]">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-bold text-[#C5C6C7]">{user.name}</CardTitle>
                <p className="text-[#C5C6C7] opacity-80">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-6">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-[#474B4F]">
                <TabsTrigger value="profile" className="data-[state=active]:bg-[#86C232] data-[state=active]:text-[#222629]">Profile</TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-[#86C232] data-[state=active]:text-[#222629]">Projects</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                {isEditing && isOwner ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="name" className="text-[#86C232]">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editedUser?.name || ''}
                        onChange={handleChange}
                        className="bg-[#474B4F] border-[#86C232] text-[#C5C6C7] focus:border-[#61892F]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-[#86C232]">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        rows={5}
                        value={editedUser?.bio || ''}
                        onChange={handleChange}
                        className="bg-[#474B4F] border-[#86C232] text-[#C5C6C7] focus:border-[#61892F]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="text-[#86C232]">Experience Level</Label>
                      <Input
                        id="experience"
                        name="experience"
                        value={editedUser?.experience || ''}
                        onChange={handleChange}
                        className="bg-[#474B4F] border-[#86C232] text-[#C5C6C7] focus:border-[#61892F]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="skills" className="text-[#86C232]">Skills (comma-separated)</Label>
                      <Input
                        id="skills"
                        name="skills"
                        value={editedUser?.skills?.join(', ') || ''}
                        onChange={(e) => setEditedUser(prev => prev ? { ...prev, skills: e.target.value.split(',').map(skill => skill.trim()) } : null)}
                        className="bg-[#474B4F] border-[#86C232] text-[#C5C6C7] focus:border-[#61892F]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="SOLAddress" className="text-[#86C232]">Solana Wallet Address</Label>
                      <Input
                        id="SOLAddress"
                        name="walletAddressSOL"
                        value={editedUser?.walletAddressSOL || ''}
                        onChange={handleChange}
                        className="bg-[#474B4F] border-[#86C232] text-[#C5C6C7] focus:border-[#61892F]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ETHAddress" className="text-[#86C232]">Ethereum Wallet Address</Label>
                      <Input
                        id="ETHAddress"
                        name="walletAddressETH"
                        value={editedUser?.walletAddressETH || ''}
                        onChange={handleChange}
                        className="bg-[#474B4F] border-[#86C232] text-[#C5C6C7] focus:border-[#61892F]"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} className="bg-[#86C232] hover:bg-[#61892F] text-[#222629]">
                        <Save className="mr-2 h-4 w-4" /> Save
                      </Button>
                      <Button onClick={handleCancel} variant="destructive" className="border-[#86C232] text-[#C5C6C7] hover:bg-red-800">
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
                      <Label className="text-[#86C232]">Bio</Label>
                      <p className="text-[#C5C6C7] break-words">{user.bio || 'No bio available'}</p>
                    </div>
                    <div>
                      <Label className="text-[#86C232]">Experience Level</Label>
                      <p className="text-[#C5C6C7]">{user.experience || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-[#86C232]">Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.skills && user.skills.length > 0 ? (
                          user.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#61892F] text-[#C5C6C7]">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-[#C5C6C7]">No skills specified</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#86C232]">Solana Wallet Address</Label>
                      <p className="text-[#C5C6C7]">{user.walletAddressSOL || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-[#86C232]">Ethereum Wallet Address</Label>
                      <p className="text-[#C5C6C7]">{user.walletAddressETH || 'Not specified'}</p>
                    </div>
                    {isOwner && (
                      <Button onClick={handleEdit} className="bg-[#86C232] hover:bg-[#61892F] text-[#222629]">
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                      </Button>
                    )}
                  </motion.div>
                )}
              </TabsContent>
              <TabsContent value="projects">
                <div className="space-y-4">
                  {user.projectsCreated.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-center text-[#86C232] text-xl"
                    >
                      No projects created
                    </motion.p>
                  ) : (
                    user.projectsCreated.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="bg-[#474B4F] border-[#86C232] border-opacity-50">
                          <CardHeader>
                            <CardTitle className="text-xl flex items-center text-[#86C232]">
                              <Briefcase className="mr-2 h-5 w-5 text-[#61892F]" />
                              {project.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-[#C5C6C7] mb-4">{project.description}</p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center">
                                <DollarSign className="mr-2 h-5 w-5 text-[#61892F]" />
                                <span className="text-[#C5C6C7]">Budget: ${project.budget}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5 text-[#61892F]" />
                                <span className="text-[#C5C6C7]">Time: {project.timeExpected || 'Not specified'}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="mr-2 h-5 w-5 text-[#61892F]" />
                                <span className="text-[#C5C6C7]">Experience: {project.experienceReq}</span>
                              </div>
                            </div>
                            <div className="mb-4">
                              <Label className="text-[#86C232]">Required Skills</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {project.skillsRequired && project.skillsRequired.length > 0 ? (
                                  project.skillsRequired.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="bg-[#61892F] text-[#C5C6C7]">
                                      {skill}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-[#C5C6C7]">No specific skills required</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <Label className="text-[#86C232]">Client</Label>
                              <div className="flex items-center mt-2">
                                <User className="mr-2 h-5 w-5 text-[#61892F]" />
                                <span className="text-[#C5C6C7] mr-4">{project.client.name}</span>
                                <Mail className="mr-2 h-5 w-5 text-[#61892F]" />
                                <span className="text-[#C5C6C7]">{project.client.email}</span>
                              </div>
                            </div>
                            <div>
                              <button
                                onClick={() => router.push(`/projects/${project.id}/proposals`)}
                                className="bg-[#86C232] hover:bg-[#61892F] text-[#222629] py-2 px-4 rounded transition"
                              >
                                View Proposals
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
