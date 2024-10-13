'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import axios from 'axios'

const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'HTML/CSS', 'SQL', 'Git', 'Docker']
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

export default function OnboardingComponent() {
  const [bio, setBio] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [experience, setExperience] = useState('')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  const handleComplete = async () => {
    const response = await axios.put('/api/user/account',{
     bio,
     skills:selectedSkills,
     experience
    }
)
    console.log(response)
  } 

  return (
    <motion.div
      className="min-h-screen bg-black text-white p-8 flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-800 shadow-xl">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-3xl font-bold text-center text-white">
            Set Up Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <motion.div variants={itemVariants}>
            <Label htmlFor="bio" className="text-xl font-semibold mb-2 block text-gray-200">
              About You
            </Label>
            <Textarea
              id="bio"
              placeholder="Share your story, projects, and experiences... (optional)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-32 bg-gray-800 text-white border-gray-700 focus:border-white focus:ring-white placeholder-gray-500"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label className="text-xl font-semibold mb-2 block text-gray-200">Your Skills (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? 'default' : 'secondary'}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedSkills.includes(skill)
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedSkills(prev => 
                    prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
                  )}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label className="text-xl font-semibold mb-2 block text-gray-200">Experience Level (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {experienceLevels.map((level) => (
                <Button
                  key={level}
                  variant={experience === level ? 'default' : 'secondary'}
                  onClick={() => setExperience(level)}
                  className={`transition-all hover:scale-105 ${
                    experience === level
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {level}
                </Button>
              ))}
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-gray-800 pt-6">
          <Button onClick={handleComplete} className="bg-white text-black hover:bg-gray-200">
            Complete Profile <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}