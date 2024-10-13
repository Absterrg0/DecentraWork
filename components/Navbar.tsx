"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
export default function NavBar() {

  const handleGetStarted = () =>{
    router.push('/signup')
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router=useRouter();
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-3xl z-50">
      <div className="relative p-[1px] overflow-hidden rounded-full bg-gradient-to-r from-[#4d9abf] to-[#8a2be2]">
        <motion.div
          className="absolute inset-0 bg-[conic-gradient(transparent_0deg,#7b68ee_180deg,transparent_360deg)]"
          style={{ originX: 0.5, originY: 0.5 }}
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
        />
        <motion.nav 
          className="relative z-10 bg-gradient-to-r from-zinc-900 to-black rounded-full px-6 py-3"
          initial={{ borderRadius: "9999px" }}
          animate={{ 
            borderRadius: ["9999px", "40px", "9999px"],
            boxShadow: [
              "0 0 0 1px rgba(255,255,255,0.1)",
              "0 0 0 2px rgba(255,255,255,0.2)",
              "0 0 0 1px rgba(255,255,255,0.1)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="flex items-center justify-between">
            <motion.button 
              className="text-white font-bold text-xl tracking-wide"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              DecentraWork
            </motion.button>
            <div className="hidden md:flex items-center space-x-8">
                <motion.button 
                  className="text-neutral-300 hover:text-white transition-colors text-sm uppercase tracking-wider"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                >
                  Get Started
                </motion.button>
            </div>
            <motion.button
              className="text-neutral-300 hover:text-white transition-colors md:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </motion.nav>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-2 bg-gradient-to-r from-zinc-900 to-black backdrop-blur-md rounded-lg p-4 md:hidden border border-white/10"
        >
          {["About", "Contact"].map((item) => (
            <motion.a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="block py-2 text-neutral-300 hover:text-white transition-colors text-sm uppercase tracking-wider"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.a>
          ))}
        </motion.div>
      )}
    </div>
  )
}
