'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, User, Send, ChevronRight, Loader2 } from 'lucide-react'

type UserDetails = {
  id: number
  name: string
  email: string
}

type Project = {
  id: number
  title: string
  client: UserDetails
  assigned: UserDetails
}

type Message = {
  id: number
  content: string
  createdAt: string
  senderId: number
  receiverId: number
  projectId: number
}

const MessageContent = ({ content }: { content: string }) => {
  const formatContent = (text: string) => {
    const lines: string[] = []
    let currentLine = ''
    
    for (let i = 0; i < text.length; i++) {
      currentLine += text[i]
      
      if (currentLine.length === 100 || i === text.length - 1) {
        if (i !== text.length - 1 && text[i + 1] !== ' ') {
          const lastSpaceIndex = currentLine.lastIndexOf(' ')
          if (lastSpaceIndex !== -1) {
            lines.push(currentLine.substring(0, lastSpaceIndex))
            currentLine = currentLine.substring(lastSpaceIndex + 1)
            i -= (currentLine.length - 1)
          } else {
            lines.push(currentLine)
            currentLine = ''
          }
        } else {
          lines.push(currentLine)
          currentLine = ''
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    return lines
  }

  const lines = formatContent(content)

  return (
    <div className="whitespace-pre-wrap break-words">
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function AssignedProjectComponent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { id } = useParams()

  useEffect(() => {
    fetchProjects()
  }, [id])

  useEffect(() => {
    if (selectedProject && !isConnecting) {
      fetchProjectMessages(selectedProject.id)
      initializeWebSocket()
    }
    
    return () => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [selectedProject])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`/api/user/account/${id}/assigned-projects`)
      setProjects(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setIsLoading(false)
    }
  }

  const fetchProjectMessages = async (projectId: number) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/messages`)
      setMessages(response.data.messages)
    } catch (error) {
      console.error('Error fetching project messages:', error)
    }
  }

  const initializeWebSocket = () => {
    setIsConnecting(true)
    const PORT = process.env.NEXT_PUBLIC_WEBSOCKET_PORT || '8080'
    const ws = new WebSocket(`ws://localhost:${PORT}`)
    
    ws.onopen = () => {
      console.log('WebSocket connection established')
      setSocket(ws)
      setIsConnecting(false)
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as Message
        setMessages((prevMessages) => [...prevMessages, message])
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnecting(false)
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
      setSocket(null)
      setIsConnecting(false)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN || !selectedProject) {
      return
    }

    const messageData = {
      content: newMessage.trim(),
      senderId: selectedProject.assigned.id,
      receiverId: selectedProject.client.id,
      projectId: selectedProject.id,
    }

    try {
      socket.send(JSON.stringify(messageData))
      
      const optimisticMessage: Message = {
        id: Date.now(),
        ...messageData,
        createdAt: new Date().toISOString(),
      }
      setMessages((prevMessages) => [...prevMessages, optimisticMessage])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <motion.div 
      className="flex h-full bg-[#222629] text-gray-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-1/4 border-r border-[#86C232] p-4"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-4 text-[#86C232]">Assigned Projects</h2>
        <ScrollArea className="h-[calc(100vh-6rem)]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-[#86C232]" />
            </div>
          ) : (
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                    selectedProject?.id === project.id ? 'bg-[#474B4F]' : 'hover:bg-[#2F3439]'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-[#86C232]">{project.title}</span>
                    <span className="text-xs text-gray-400">{project.client.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#86C232]" />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </ScrollArea>
      </motion.div>
      <motion.div 
        className="flex-1 flex flex-col p-4"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {selectedProject ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-[#86C232] flex items-center">
              <MessageCircle className="mr-2 h-6 w-6" />
              Chat with {selectedProject.client.name}
              {isConnecting && (
                <motion.span 
                  className="ml-2 text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  (Connecting...)
                </motion.span>
              )}
            </h2>
            <div className="flex-1 bg-[#2F3439] rounded-lg p-4 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <AnimatePresence>
                  {messages.map((message, index) => {
                    const isFreelancer = message.senderId === selectedProject.assigned.id
                    const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${isFreelancer ? 'justify-end' : 'justify-start'} mb-4`}
                      >
                        {!isFreelancer && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-[#86C232] flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-[#222629]" />
                          </div>
                        )}
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isFreelancer ? 'bg-[#86C232] text-[#222629]' : 'bg-[#474B4F] text-gray-300'
                          }`}
                        >
                          <MessageContent content={message.content} />
                        </div>
                        {isFreelancer && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-[#61892F] flex items-center justify-center ml-2">
                            <User className="h-4 w-4 text-[#222629]" />
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </ScrollArea>
              <Separator className="my-4" />
              <motion.div 
                className="flex items-center mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={!socket || socket.readyState !== WebSocket.OPEN}
                  className="flex-grow mr-2 bg-[#474B4F] text-gray-300 border-[#86C232] focus:ring-[#86C232] focus:border-[#86C232]"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!socket || socket.readyState !== WebSocket.OPEN}
                  className="bg-[#86C232] text-[#222629] hover:bg-[#61892F] disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div 
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-[#86C232] mx-auto mb-4" />
              <p className="text-xl">Select a project to start chatting</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}