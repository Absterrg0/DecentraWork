'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function ProfileCompletionModal({ isOpen, onClose, onComplete }: ProfileCompletionModalProps) {
  const { data: session } = useSession();
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.id) {
      try {
        await axios.put(`/api/users/${session.user.id}`, {
          experience,
          skills: skills.split(',').map(skill => skill.trim()),
          bio
        });
        onComplete();
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black bg-opacity-90 text-white border border-yellow-400">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-gray-300">
            Please provide the following information to complete your profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-yellow-400">Experience</label>
            <Input
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-black bg-opacity-50 border-yellow-400 focus:border-pink-500 text-white placeholder-gray-400"
              placeholder="e.g., 5 years in web development"
            />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-yellow-400">Skills (comma-separated)</label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-black bg-opacity-50 border-yellow-400 focus:border-pink-500 text-white placeholder-gray-400"
              placeholder="e.g., React, Node.js, TypeScript"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-yellow-400">Bio</label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-black bg-opacity-50 border-yellow-400 focus:border-pink-500 text-white placeholder-gray-400"
              placeholder="Tell us about yourself..."
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white transition-all duration-300 transform hover:scale-105">
              Complete Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}