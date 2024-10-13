'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function SignupForm() {
  const [name, setName] = useState('')  // Updated field
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = () => {
    router.push('/signin')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Make the API call to create the account
      await axios.post('/api/user/account', { name, email, password })  // Updated field
      setIsLoading(false)

      // Show a success toast
      toast({
        title: "Account created!",
        description: "You've successfully signed up.",
      })

      // Redirect to the home page after 3 seconds
      setTimeout(() => {
        router.push('/onboarding') // Redirect to home
      }, 3000)
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "There was a problem creating your account.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-800 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-zinc-800 rounded-lg shadow-xl overflow-hidden p-8"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-neutral-300">Name</Label>  {/* Updated field */}
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-zinc-700 text-white border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-zinc-700 text-white border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-zinc-700 text-white border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-neutral-200">
            Already have an account?{' '}
            <Button onClick={handleLogin} className="font-medium text-blue-400 hover:text-blue-300">
              Log in
            </Button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
