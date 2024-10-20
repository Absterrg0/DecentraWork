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
  const [walletAddressSOL,setwalletAddressSOL]= useState('')
  const [walletAddressETH,setwalletAddressETH]= useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.id) {
      try {
        await axios.put(`/api/user/account/${session.user.id}`, {
          experience,
          skills: skills.split(',').map(skill => skill.trim()),
          bio,
          walletAddressETH,
          walletAddressSOL
        });
        onComplete();
        onClose(); // Close modal after completion
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#2F3439] bg-opacity-90 text-white border border-[#86C232]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#86C232] to-[#61892F]">
            Complete Your Profile
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Please provide the following information to complete your profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-[#86C232]">Experience</label>
            <Input
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-[#474B4F] bg-opacity-70 border-[#86C232] focus:border-[#61892F] text-white placeholder-gray-400"
              placeholder="e.g., 5 years in web development"
            />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-[#86C232]">Skills (comma-separated)</label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-[#474B4F] bg-opacity-70 border-[#86C232] focus:border-[#61892F] text-white placeholder-gray-400"
              placeholder="e.g., React, Node.js, TypeScript"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-[#86C232]">Bio</label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#474B4F] bg-opacity-70 border-[#86C232] focus:border-[#61892F] text-white placeholder-gray-400"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label htmlFor="walletAddressSOL" className="block text-sm font-medium text-[#86C232]">Solana Wallet Address</label>
            <Textarea
              id="walletAddressSOl"
              value={walletAddressSOL}
              onChange={(e) => setwalletAddressSOL(e.target.value)}
              className="w-full bg-[#474B4F] bg-opacity-70 border-[#86C232] focus:border-[#61892F] text-white placeholder-gray-400"
              placeholder="Enter your solana wallet address"
            />
          </div>
          <div>
            <label htmlFor="walletAddressETH" className="block text-sm font-medium text-[#86C232]">Ethereum Wallet Address</label>
            <Textarea
              id="walletAddressETH"
              value={walletAddressETH}
              onChange={(e) => setwalletAddressETH(e.target.value)}
              className="w-full bg-[#474B4F] bg-opacity-70 border-[#86C232] focus:border-[#61892F] text-white placeholder-gray-400"
              placeholder="Enter your ethereum wallet address"
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#86C232] to-[#61892F] hover:from-[#61892F] hover:to-[#86C232] text-white transition-all duration-300 transform hover:scale-105"
            >
              Complete Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
