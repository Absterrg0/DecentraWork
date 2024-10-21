'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, User } from 'lucide-react'

type Project = {
  id: number
  title: string
  description: string
  client: {
    id: number
    name: string
    email: string
  }
  assigned: {
    id: number
    name: string
    email: string
  }
}

export default function CreatedProjectsMessagesComponent() {
  const [createdProjects, setCreatedProjects] = useState<Project[]>([])
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<{ id: number; content: string; createdAt: string; senderId: number; receiverId: number }[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [client, setClient] = useState<{ id: number; name: string; email: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { id } = useParams()

  useEffect(() => {
    fetchProjects()
    fetchClientDetails()
  }, [id])

  useEffect(() => {
    if (selectedProject) {
      fetchProjectMessages(selectedProject.id)
      initializeWebSocket(selectedProject.id)
    }
  }, [selectedProject])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`/api/user/account/${id}/created-projects`)
      setCreatedProjects(response.data)
      setAssignedProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchClientDetails = async () => {
    try {
      const response = await axios.get(`/api/user/${id}`)
      setClient(response.data)
    } catch (error) {
      console.error('Error fetching client details:', error)
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

  const initializeWebSocket = (projectId: number) => {
    const ws = new WebSocket(`ws://localhost:8080`)
    setSocket(ws)

    ws.onopen = () => {
      console.log('WebSocket connection established')
      // Send project ID to server for room assignment
      ws.send(JSON.stringify({ type: 'join', projectId }))
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages((prevMessages) => [...prevMessages, message])
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }

  const sendMessage = () => {
    if (newMessage.trim() && socket && socket.readyState === WebSocket.OPEN && selectedProject) {
      const message = {
        content: newMessage,
        senderId: client?.id,
        receiverId: selectedProject.assigned.id,
        projectId: selectedProject.id,
      }
      socket.send(JSON.stringify(message))
      setNewMessage('')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex h-screen bg-[#222629] text-gray-300">
      <div className="w-1/3 border-r border-[#86C232] p-4">
        <h2 className="text-2xl font-bold mb-4 text-[#86C232]">Your Projects</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {createdProjects.map((project) => (
            <Card
              key={project.id}
              className="mb-4 bg-[#2F3439] border-[#86C232] cursor-pointer hover:bg-[#474B4F] transition-colors duration-300"
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader>
                <CardTitle className="text-[#86C232]">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4" />
                  <span>{project.client.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {assignedProjects.map((project) => (
            <Card
              key={project.id}
              className="mb-4 bg-[#2F3439] border-[#86C232] cursor-pointer hover:bg-[#474B4F] transition-colors duration-300"
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader>
                <CardTitle className="text-[#86C232]">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4" />
                  <span>{project.client.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>
      <div className="w-2/3 p-4">
        {selectedProject ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-[#86C232]">Chat with {selectedProject.assigned.name}</h2>
            <Card className="bg-[#2F3439] border-[#86C232]">
              <CardContent>
                <ScrollArea className="h-[calc(100vh-16rem)] mb-4 p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-2 p-2 rounded ${
                        message.senderId === client?.id ? 'bg-[#86C232] text-right' : 'bg-[#474B4F]'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <Separator className="my-4" />
                <div className="flex">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow mr-2 bg-[#474B4F] text-gray-300 border-[#86C232]"
                  />
                  <Button onClick={sendMessage} className="bg-[#86C232] text-white hover:bg-[#61892F]">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-[#86C232] mx-auto mb-4" />
              <p className="text-xl">Select a project to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}