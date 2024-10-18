'use client'

import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, User } from 'lucide-react'
import axios from 'axios'

const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'HTML/CSS', 'SQL', 'Git', 'Docker']
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function OnboardingComponent() {
  const [bio, setBio] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [experience, setExperience] = useState('')

  const handleComplete = async () => {
    const response = await axios.put('/api/user/account', {
      bio,
      skills: selectedSkills,
      experience
    })
    console.log(response)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0B0C10] to-[#1F2833] text-[#C5C6C7]">
      <motion.div
        className="p-4 max-w-4xl mx-auto w-full"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        <Card className="bg-[#1F2833] border-[#66FCF1]/20 shadow-xl">
          <CardHeader className="border-b border-[#66FCF1]/20 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#66FCF1] rounded-full p-3">
              <User className="w-8 h-8 text-[#0B0C10]" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-br from-[#66FCF1] to-[#C5C6C7] mt-6">
              Set Up Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <motion.div variants={fadeIn}>
              <Label htmlFor="bio" className="text-xl font-semibold mb-2 block text-[#66FCF1]">
                About You
              </Label>
              <Textarea
                id="bio"
                placeholder="Share your story, projects, and experiences... (optional)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-32 bg-[#0B0C10] text-[#C5C6C7] border-[#66FCF1]/20 focus:border-[#66FCF1] focus:ring-[#66FCF1] placeholder-[#C5C6C7]/50 rounded-md"
              />
            </motion.div>

            <motion.div variants={fadeIn}>
              <Label className="text-xl font-semibold mb-2 block text-[#66FCF1]">Your Skills (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? 'default' : 'secondary'}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedSkills.includes(skill)
                        ? 'bg-[#66FCF1] text-[#0B0C10] hover:bg-[#45A29E]'
                        : 'bg-[#0B0C10] text-[#C5C6C7] hover:bg-[#2F3943] border border-[#66FCF1]/20'
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

            <motion.div variants={fadeIn}>
              <Label className="text-xl font-semibold mb-2 block text-[#66FCF1]">Experience Level (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {experienceLevels.map((level) => (
                  <Button
                    key={level}
                    variant={experience === level ? 'default' : 'secondary'}
                    onClick={() => setExperience(level)}
                    className={`transition-all hover:scale-105 ${
                      experience === level
                        ? 'bg-[#66FCF1] text-[#0B0C10] hover:bg-[#45A29E]'
                        : 'bg-[#0B0C10] text-[#C5C6C7] hover:bg-[#2F3943] border border-[#66FCF1]/20'
                    }`}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-[#66FCF1]/20 pt-6">
            <Button 
              onClick={handleComplete} 
              className="bg-[#66FCF1] text-[#0B0C10] hover:bg-[#45A29E] transition duration-300 ease-in-out rounded-full shadow-lg transform hover:scale-105"
            >
              Complete Profile <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}