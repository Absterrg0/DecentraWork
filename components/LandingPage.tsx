'use client'
import React from "react";
import { Spotlight } from "./ui/spotlight";
import { Button } from "./ui/button";
import NavBar from "./Navbar";
import { motion } from "framer-motion";

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 },
  };

  return (
    <div className="h-screen w-full flex md:items-center md:justify-center bg-gradient-to-b from-[#1b1b1b] to-[#3e3e3e] antialiased relative overflow-hidden">
      <NavBar />
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#FFD700" />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <motion.h1
          className="text-5xl md:text-8xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-br from-yellow-500 to-orange-500 bg-opacity-90"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          Welcome to DecentraWork
        </motion.h1>
        <motion.h2
          className="text-3xl md:text-5xl font-semibold text-center text-yellow-300 mt-4"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          Empowering Decentralized Freelancing
        </motion.h2>
        <motion.p
          className="mt-6 font-normal text-lg text-yellow-200 max-w-lg text-center mx-auto"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          Discover a new way to connect and collaborate with freelancers around the globe. 
          With blockchain technology, experience secure transactions and build trust effortlessly.
        </motion.p>
        <div className="mt-10 flex justify-center space-x-4">
          <Button 
            variant="default" 
            size="lg" 
            className="bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300 ease-in-out rounded-full shadow-lg transform hover:scale-105"
          >
            Sign Up
          </Button>
        </div>
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
        >
          <div className="p-4 rounded-lg bg-black/[0.5] shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-yellow-300">Secure Transactions</h3>
            <p className="text-sm text-yellow-400">Experience peace of mind with smart contracts.</p>
          </div>
          <div className="p-4 rounded-lg bg-black/[0.5] shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-yellow-300">Diverse Talent Pool</h3>
            <p className="text-sm text-yellow-400">Connect with professionals across the world.</p>
          </div>
          <div className="p-4 rounded-lg bg-black/[0.5] shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-yellow-300">Minimal Fees</h3>
            <p className="text-sm text-yellow-400">Maximize your earnings on our platform.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
