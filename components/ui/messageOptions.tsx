'use client'

import React, { useState } from 'react'
import { MessageCircle, FolderOpen, Briefcase } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function MessageOptions() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleViewCreatedProjects = () => {
    setIsOpen(false)
    if (session?.user?.id) {
      router.push(`/user/${session.user.id}/created-projects/messages`)
    }
  }

  const handleViewAssignedProjects = () => {
    setIsOpen(false)
    if (session?.user?.id) {
      router.push(`/user/${session.user.id}/assigned-projects/messages`)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-gray-300 hover:text-[#86C232] transition-colors duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-[#2F3439] border border-[#86C232] rounded-lg shadow-xl p-0">
        <div className="flex flex-col">
          <Button
            variant="ghost"
            className="flex items-center justify-start px-4 py-2 text-gray-300 hover:bg-[#474B4F] hover:text-[#86C232] transition-colors duration-300"
            onClick={handleViewCreatedProjects}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Created Projects</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-start px-4 py-2 text-gray-300 hover:bg-[#474B4F] hover:text-[#86C232] transition-colors duration-300"
            onClick={handleViewAssignedProjects}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Assigned Projects</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}